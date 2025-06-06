// Modelos matemáticos
export function circadianModel(t: number, a: number, b: number, c: number) {
  return (
    a +
    b * Math.sin((2 * Math.PI * t) / 24) +
    c * Math.cos((2 * Math.PI * t) / 24)
  );
}

export function extendedSinusoidalModel(
  t: number,
  a: number,
  b: number,
  c: number,
  d: number
) {
  return (
    a +
    (b * Math.sin((2 * Math.PI * t) / 24) +
      c * Math.cos((2 * Math.PI * t) / 24)) /
      (1 - d * Math.sin((2 * Math.PI * t) / 24))
  );
}

// Estadísticos y utilidades
import * as ss from "simple-statistics";

export function mannWhitneyU(x: number[], y: number[]) {
  const all = x.concat(y).sort((a, b) => a - b);
  const ranks = all.map((v, i) => ({ v, r: i + 1 }));
  const rankMap = new Map<number, number>();
  for (const { v, r } of ranks) {
    if (!rankMap.has(v)) rankMap.set(v, r);
  }
  const rankX = x.map((v) => rankMap.get(v) || 0);
  const rankY = y.map((v) => rankMap.get(v) || 0);
  const U1 = ss.sum(rankX) - (x.length * (x.length + 1)) / 2;
  const U2 = ss.sum(rankY) - (y.length * (y.length + 1)) / 2;
  const U = Math.min(U1, U2);
  const n1 = x.length,
    n2 = y.length;
  const mu = (n1 * n2) / 2;
  const sigma = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
  const z = (U - mu) / sigma;
  const p = 2 * (1 - ss.cumulativeStdNormalProbability(Math.abs(z)));
  return { U, p };
}

export function iqr(arr: number[]) {
  return (
    ss.quantileSorted(
      arr.slice().sort((a, b) => a - b),
      0.75
    ) -
    ss.quantileSorted(
      arr.slice().sort((a, b) => a - b),
      0.25
    )
  );
}

// Funciones matemáticas auxiliares
export function ibeta(x: number, a: number, b: number): number {
  const bt =
    x === 0 || x === 1
      ? 0
      : Math.exp(
          lgamma(a + b) -
            lgamma(a) -
            lgamma(b) +
            a * Math.log(x) +
            b * Math.log(1 - x)
        );
  if (x < 0 || x > 1) throw new Error("x fuera de rango en ibeta");
  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betacf(x, a, b)) / a;
  } else {
    return 1 - (bt * betacf(1 - x, b, a)) / b;
  }
}
export function betacf(x: number, a: number, b: number): number {
  let m2, aa, del, h;
  const MAXIT = 100,
    EPS = 3.0e-7,
    FPMIN = 1.0e-30;
  const qab = a + b;
  const qap = a + 1.0;
  const qam = a - 1.0;
  let c = 1.0;
  let d = 1.0 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1.0 / d;
  h = d;
  for (let m = 1; m <= MAXIT; m++) {
    m2 = 2 * m;
    aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1.0 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
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
export function lgamma(z: number): number {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5)
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let x = p[0];
  for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
  const t = z + g + 0.5;
  return (
    0.5 * Math.log(2 * Math.PI) +
    (z + 0.5) * Math.log(t) -
    t +
    Math.log(x) -
    Math.log(z + 1)
  );
}
export function fCDF(x: number, d1: number, d2: number): number {
  if (x < 0) return 0;
  const xx = (d1 * x) / (d1 * x + d2);
  return ibeta(xx, d1 / 2, d2 / 2);
}
