// Mappers para el análisis circadiano y Mann-Whitney

import {
  CircadianAnalysisResults,
  CircadianGroupResult,
} from "@/app/(page)/analyze/page";

export function mapInputToDataFrame(
  timePoints: number[],
  groups: string[],
  values: number[][]
) {
  return timePoints.map((tp, i) => {
    const row: { [key: string]: number } = { "Time point": tp };
    groups.forEach((g, j) => {
      row[g] = values[j][i];
    });
    return row;
  });
}

export function mapCircadianResult({
  mesor,
  amplitude,
  acrophase,
  acrophase_rad,
  peak_time,
  mse,
  r2,
  chi2,
  f_statistic,
  p_value,
  is_significant,
  model_type,
}: any) {
  return {
    mesor,
    amplitude,
    acrophase,
    acrophase_rad,
    peak_time,
    mse,
    r2,
    chi2,
    f_statistic,
    p_value,
    is_significant,
    model_type,
  };
}

export function mapMannWhitneyResult({ U, p }: { U: number; p: number }) {
  return {
    U_statistic: U,
    p_value: p,
  };
}

export function getTableData(analysisResults: CircadianAnalysisResults) {
  if (!analysisResults?.circadian_analysis) return [];
  return Object.entries(analysisResults.circadian_analysis).map(
    ([group, values]: [string, CircadianGroupResult]) => ({
      group,
      mesor: values.mesor,
      amplitude: values.amplitude,
      acrophase: values.acrophase,
      acrophase_rad: values.acrophase_rad,
      peak_time: values.peak_time,
      mse: values.mse,
      r2: values.r2,
      chi2: values.chi2,
      f_statistic: values.f_statistic,
      p_value: values.p_value,
    })
  );
}
