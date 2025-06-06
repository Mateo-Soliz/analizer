import { levenbergMarquardt } from "ml-levenberg-marquardt";
import { NextResponse } from "next/server";
import * as ss from "simple-statistics";

// Importa las funciones desde el servicio
import {
  circadianModel,
  extendedSinusoidalModel,
  fCDF,
  iqr,
  mannWhitneyU,
} from "@/lib/server-only/analyzer/analizer.service";
// Importa los mappers
import {
  mapCircadianResult,
  mapInputToDataFrame,
  mapMannWhitneyResult,
} from "@/lib/server-only/analyzer/analizer.mapper";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.timePoints || !data.groups || !data.values) {
      return NextResponse.json(
        {
          error: "Datos incompletos. Se requieren timePoints, groups y values",
        },
        { status: 400 }
      );
    }

    const timePoints: number[] = data.timePoints;
    const groups: string[] = data.groups;
    const values: number[][] = data.values;
    const useExtendedModel = !!data.useExtendedModel;
    const noSignificant = data.noSignificant || 0.999;

    // Usa el mapper para construir el dataframe
    const df = mapInputToDataFrame(timePoints, groups, values);

    const results: Record<string, unknown> = {};
    const plotData: {
      time_points: number[];
      groups: Record<string, unknown>;
    } = {
      time_points: Array.from({ length: 1000 }, (_, i) => (i * 24) / 999),
      groups: {},
    };

    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi];
      const t: number[] = [];
      const y: number[] = [];
      for (let i = 0; i < df.length; i++) {
        const v = df[i][group];
        if (v !== null && v !== undefined && !isNaN(v)) {
          t.push(df[i]["Time point"]);
          y.push(v);
        }
      }
      const statsMap = new Map<number, number[]>();
      for (let i = 0; i < t.length; i++) {
        if (!statsMap.has(t[i])) statsMap.set(t[i], []);
        statsMap.get(t[i])!.push(y[i]);
      }
      const stats = Array.from(statsMap.entries()).map(([tp, arr]) => ({
        timePoint: tp,
        median: ss.median(arr),
        iqr: iqr(arr),
      }));
      plotData.groups[group] = {
        raw_data: {
          time_points: t,
          values: y,
        },
        descriptive_stats: {
          time_points: stats.map((s) => s.timePoint),
          medians: stats.map((s) => s.median),
          iqr: stats.map((s) => s.iqr),
        },
      };
      let modelFunc: (params: number[]) => (t: number) => number,
        initialParams: number[],
        paramCount: number;
      if (useExtendedModel) {
        modelFunc = (params: number[]) => (t: number) =>
          extendedSinusoidalModel(
            t,
            params[0],
            params[1],
            params[2],
            params[3]
          );
        initialParams = [ss.mean(y), 1, 1, 0.1];
        paramCount = 4;
      } else {
        modelFunc = (params: number[]) => (t: number) =>
          circadianModel(t, params[0], params[1], params[2]);
        initialParams = [ss.mean(y), 1, 1];
        paramCount = 3;
      }
      let paramsFull: number[] = initialParams;
      let yPredFull: number[] = [];
      let sseFull = 0,
        dfFull = 0;
      try {
        const fit = levenbergMarquardt(
          {
            x: t,
            y: y,
          },
          modelFunc,
          {
            initialValues: initialParams,
            damping: 1.5,
            gradientDifference: 1e-2,
            maxIterations: 100,
            errorTolerance: 1e-3,
          }
        );
        paramsFull = fit.parameterValues;
        yPredFull = t.map((tt) => modelFunc(paramsFull)(tt));
        sseFull = ss.sum(y.map((v, i) => Math.pow(v - yPredFull[i], 2)));
        dfFull = y.length - paramCount;
      } catch {
        results[group] = { error: "No se pudo ajustar el modelo completo" };
        (
          plotData.groups[group] as { [key: string]: unknown } & {
            fitted_curve?: unknown;
          }
        ).fitted_curve = null;
        continue;
      }
      const paramsReduced: number[] = [ss.mean(y)];
      const yPredReduced: number[] = t.map(() => paramsReduced[0]);
      const sseReduced = ss.sum(
        y.map((v, i) => Math.pow(v - yPredReduced[i], 2))
      );
      const dfReduced = y.length - 1;
      const num = (sseReduced - sseFull) / (dfReduced - dfFull);
      const denom = sseFull / dfFull;
      const fStat = num / denom;
      const pValueF = 1 - fCDF(fStat, dfReduced - dfFull, dfFull);
      const a = paramsFull[0],
        b = paramsFull[1],
        c = paramsFull[2];
      const mesor = a;
      const amplitude = Math.sqrt(b ** 2 + c ** 2);
      const acrophaseRad = Math.atan2(c, b);
      const acrophaseHours = ((acrophaseRad * 24) / (2 * Math.PI)) % 24;
      const mse = ss.mean(y.map((v, i) => Math.pow(v - yPredFull[i], 2)));
      const ssTot = ss.sum(y.map((v) => Math.pow(v - ss.mean(y), 2)));
      const r2 = 1 - sseFull / ssTot;
      const chi2 = ss.sum(
        y.map((v, i) => Math.pow(v - yPredFull[i], 2) / (yPredFull[i] + 1e-8))
      );
      const tFine = Array.from({ length: 1000 }, (_, i) => (i * 24) / 999);
      const yFit = tFine.map((tt) => modelFunc(paramsFull)(tt));
      const peakTime = tFine[yFit.indexOf(Math.max(...yFit))];
      (
        plotData.groups[group] as { [key: string]: unknown } & {
          fitted_curve?: unknown;
        }
      ).fitted_curve = {
        time_points: tFine,
        values: yFit,
        is_significant: pValueF < noSignificant,
      };
      // Usa el mapper para la respuesta del análisis circadiano
      results[group] = mapCircadianResult({
        mesor,
        amplitude,
        acrophase: acrophaseHours,
        acrophase_rad: acrophaseRad,
        peak_time: peakTime,
        mse,
        r2,
        chi2,
        f_statistic: fStat,
        p_value: pValueF,
        is_significant: pValueF < noSignificant,
        model_type: useExtendedModel ? "extended" : "standard",
      });
    }

    const mannWhitneyResults: Record<number, Record<string, unknown>> = {};
    const uniqueTimePoints = Array.from(new Set(timePoints)).sort(
      (a, b) => a - b
    );
    for (const tp of uniqueTimePoints) {
      mannWhitneyResults[tp] = {};
      for (let i = 0; i < groups.length; i++) {
        for (let j = i + 1; j < groups.length; j++) {
          const g1 = groups[i],
            g2 = groups[j];
          const x = df
            .filter(
              (row) =>
                row["Time point"] === tp &&
                row[g1] !== null &&
                row[g1] !== undefined &&
                !isNaN(row[g1])
            )
            .map((row) => row[g1]);
          const y = df
            .filter(
              (row) =>
                row["Time point"] === tp &&
                row[g2] !== null &&
                row[g2] !== undefined &&
                !isNaN(row[g2])
            )
            .map((row) => row[g2]);
          if (x.length > 0 && y.length > 0) {
            try {
              // Usa el mapper para la respuesta del test Mann-Whitney
              const { U, p } = mannWhitneyU(x, y);
              mannWhitneyResults[tp][`${g1}_vs_${g2}`] = mapMannWhitneyResult({
                U,
                p,
              });
            } catch {
              mannWhitneyResults[tp][`${g1}_vs_${g2}`] = {
                error: "Error en Mann-Whitney",
              };
            }
          }
        }
      }
    }

    return NextResponse.json({
      circadian_analysis: results,
      mann_whitney_tests: mannWhitneyResults,
      plot_data: plotData,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
