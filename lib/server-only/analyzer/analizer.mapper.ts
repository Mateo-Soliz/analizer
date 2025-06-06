// Mappers para el análisis circadiano y Mann-Whitney

export function mapInputToDataFrame(timePoints: number[], groups: string[], values: number[][]) {
  return timePoints.map((tp, i) => {
    const row: { [key: string]: number } = { 'Time point': tp };
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
  model_type
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
    model_type
  };
}

export function mapMannWhitneyResult({ U, p }: { U: number, p: number }) {
  return {
    U_statistic: U,
    p_value: p
  };
}
