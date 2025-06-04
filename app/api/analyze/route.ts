import { levenbergMarquardt } from 'ml-levenberg-marquardt';
import { NextResponse } from 'next/server';
import * as ss from 'simple-statistics';

// Modelos matemáticos
function circadianModel(t: number, a: number, b: number, c: number) {
  return a + b * Math.sin((2 * Math.PI * t) / 24) + c * Math.cos((2 * Math.PI * t) / 24);
}

function extendedSinusoidalModel(t: number, a: number, b: number, c: number, d: number) {
  return a + (b * Math.sin((2 * Math.PI * t) / 24) + c * Math.cos((2 * Math.PI * t) / 24)) / (1 - d * Math.sin((2 * Math.PI * t) / 24));
}

function reducedModel(t: number, a: number) {
  return a;
}

// Mann-Whitney U test (implementación manual)
function mannWhitneyU(x: number[], y: number[]) {
  const all = x.concat(y).sort((a, b) => a - b);
  const ranks = all.map((v, i) => ({ v, r: i + 1 }));
  const rankMap = new Map<number, number>();
  for (const { v, r } of ranks) {
    if (!rankMap.has(v)) rankMap.set(v, r);
  }
  const rankX = x.map(v => rankMap.get(v) || 0);
  const rankY = y.map(v => rankMap.get(v) || 0);
  const U1 = ss.sum(rankX) - (x.length * (x.length + 1)) / 2;
  const U2 = ss.sum(rankY) - (y.length * (y.length + 1)) / 2;
  const U = Math.min(U1, U2);
  const n1 = x.length, n2 = y.length;
  const mu = (n1 * n2) / 2;
  const sigma = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = (U - mu) / sigma;
  const p = 2 * (1 - ss.cumulativeStdNormalProbability(Math.abs(z)));
  return { U, p };
}

// Utilidades estadísticas
function iqr(arr: number[]) {
  return ss.quantileSorted(arr.slice().sort((a, b) => a - b), 0.75) - ss.quantileSorted(arr.slice().sort((a, b) => a - b), 0.25);
}

// Función beta regularizada incompleta
function ibeta(x: number, a: number, b: number): number {
  let bt = (x === 0 || x === 1) ? 0 :
    Math.exp(
      lgamma(a + b) - lgamma(a) - lgamma(b) +
      a * Math.log(x) + b * Math.log(1 - x)
    );
  if (x < 0 || x > 1) return 0;
  if (x < (a + 1) / (a + b + 2)) {
    return bt * betacf(x, a, b) / a;
  } else {
    return 1 - bt * betacf(1 - x, b, a) / b;
  }
}
function betacf(x: number, a: number, b: number): number {
  let m2, aa, c, d, del, h, qab, qam, qap;
  let MAXIT = 100, EPS = 3.0e-7, FPMIN = 1.0e-30;
  qab = a + b;
  qap = a + 1.0;
  qam = a - 1.0;
  c = 1.0;
  d = 1.0 - qab * x / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1.0 / d;
  h = d;
  for (let m = 1; m <= MAXIT; m++) {
    m2 = 2 * m;
    aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1.0 / d;
    h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1.0 / d;
    del = d * c;
    h *= del;
    if (Math.abs(del - 1.0) < EPS) break;
  }
  return h;
}
function lgamma(z: number): number {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let x = p[0];
  for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
  let t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x) - Math.log(z + 1);
}
function fCDF(x: number, d1: number, d2: number): number {
  if (x < 0) return 0;
  const xx = (d1 * x) / (d1 * x + d2);
  return ibeta(xx, d1 / 2, d2 / 2);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.timePoints || !data.groups || !data.values) {
      return NextResponse.json(
        { error: 'Datos incompletos. Se requieren timePoints, groups y values' },
        { status: 400 }
      );
    }

    const timePoints: number[] = data.timePoints;
    const groups: string[] = data.groups;
    const values: number[][] = data.values;
    const useExtendedModel = !!data.useExtendedModel;
    const noSignificant = data.noSignificant || 0.999;

    const df: any[] = timePoints.map((tp, i) => {
      const row: any = { 'Time point': tp };
      groups.forEach((g, j) => {
        row[g] = values[j][i];
      });
      return row;
    });

    const results: any = {};
    const plotData: any = {
      time_points: Array.from({ length: 1000 }, (_, i) => (i * 24) / 999),
      groups: {}
    };

    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi];
      const t: number[] = [];
      const y: number[] = [];
      for (let i = 0; i < df.length; i++) {
        const v = df[i][group];
        if (v !== null && v !== undefined && !isNaN(v)) {
          t.push(df[i]['Time point']);
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
        iqr: iqr(arr)
      }));
      plotData.groups[group] = {
        raw_data: {
          time_points: t,
          values: y
        },
        descriptive_stats: {
          time_points: stats.map(s => s.timePoint),
          medians: stats.map(s => s.median),
          iqr: stats.map(s => s.iqr)
        }
      };
      let modelFunc: any, initialParams: number[], paramCount: number;
      if (useExtendedModel) {
        modelFunc = (params: number[]) => (t: number) => extendedSinusoidalModel(t, params[0], params[1], params[2], params[3]);
        initialParams = [ss.mean(y), 1, 1, 0.1];
        paramCount = 4;
      } else {
        modelFunc = (params: number[]) => (t: number) => circadianModel(t, params[0], params[1], params[2]);
        initialParams = [ss.mean(y), 1, 1];
        paramCount = 3;
      }
      let paramsFull: number[] = initialParams;
      let yPredFull: number[] = [];
      let sseFull = 0, dfFull = 0;
      try {
        const fit = levenbergMarquardt({
          x: t,
          y: y,
        }, modelFunc, {
          initialValues: initialParams,
          damping: 1.5,
          gradientDifference: 1e-2,
          maxIterations: 100,
          errorTolerance: 1e-3
        });
        paramsFull = fit.parameterValues;
        yPredFull = t.map(tt => modelFunc(paramsFull)(tt));
        sseFull = ss.sum(y.map((v, i) => Math.pow(v - yPredFull[i], 2)));
        dfFull = y.length - paramCount;
      } catch (e) {
        results[group] = { error: 'No se pudo ajustar el modelo completo' };
        plotData.groups[group].fitted_curve = null;
        continue;
      }
      let paramsReduced: number[] = [ss.mean(y)];
      let yPredReduced: number[] = t.map(() => paramsReduced[0]);
      let sseReduced = ss.sum(y.map((v, i) => Math.pow(v - yPredReduced[i], 2)));
      let dfReduced = y.length - 1;
      const num = (sseReduced - sseFull) / (dfReduced - dfFull);
      const denom = sseFull / dfFull;
      const fStat = num / denom;
      const pValueF = 1 - fCDF(fStat, dfReduced - dfFull, dfFull);
      const a = paramsFull[0], b = paramsFull[1], c = paramsFull[2], d = paramsFull[3] || 0;
      const mesor = a;
      const amplitude = Math.sqrt(b ** 2 + c ** 2);
      const acrophaseRad = Math.atan2(c, b);
      const acrophaseHours = ((acrophaseRad * 24) / (2 * Math.PI)) % 24;
      const mse = ss.mean(y.map((v, i) => Math.pow(v - yPredFull[i], 2)));
      const ssTot = ss.sum(y.map(v => Math.pow(v - ss.mean(y), 2)));
      const r2 = 1 - sseFull / ssTot;
      const chi2 = ss.sum(y.map((v, i) => Math.pow(v - yPredFull[i], 2) / (yPredFull[i] + 1e-8)));
      const tFine = Array.from({ length: 1000 }, (_, i) => (i * 24) / 999);
      const yFit = tFine.map(tt => modelFunc(paramsFull)(tt));
      const peakTime = tFine[yFit.indexOf(Math.max(...yFit))];
      plotData.groups[group].fitted_curve = {
        time_points: tFine,
        values: yFit,
        is_significant: pValueF < noSignificant
      };
      results[group] = {
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
        model_type: useExtendedModel ? 'extended' : 'standard'
      };
    }

    const mannWhitneyResults: any = {};
    const uniqueTimePoints = Array.from(new Set(timePoints)).sort((a, b) => a - b);
    for (const tp of uniqueTimePoints) {
      mannWhitneyResults[tp] = {};
      for (let i = 0; i < groups.length; i++) {
        for (let j = i + 1; j < groups.length; j++) {
          const g1 = groups[i], g2 = groups[j];
          const x = df.filter(row => row['Time point'] === tp && row[g1] !== null && row[g1] !== undefined && !isNaN(row[g1])).map(row => row[g1]);
          const y = df.filter(row => row['Time point'] === tp && row[g2] !== null && row[g2] !== undefined && !isNaN(row[g2])).map(row => row[g2]);
          if (x.length > 0 && y.length > 0) {
            try {
              const { U, p } = mannWhitneyU(x, y);
              mannWhitneyResults[tp][`${g1}_vs_${g2}`] = { U_statistic: U, p_value: p };
            } catch (e) {
              mannWhitneyResults[tp][`${g1}_vs_${g2}`] = { error: 'Error en Mann-Whitney' };
            }
          }
        }
      }
    }

    return NextResponse.json({
      circadian_analysis: results,
      mann_whitney_tests: mannWhitneyResults,
      plot_data: plotData
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
} 