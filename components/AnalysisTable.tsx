import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GroupAnalysis {
  group: string;
  mesor: number;
  amplitude: number;
  acrophase: number;
  acrophase_rad?: number;
  peak_time?: number;
  mse?: number;
  r2?: number;
  chi2?: number;
  f_statistic: number;
  p_value: number;
}

interface AnalysisTableProps {
  data: GroupAnalysis[];
}

export default function AnalysisTable({ data }: AnalysisTableProps) {
  console.log("data", JSON.stringify(data, null, 2));
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Grupo</TableHead>
          <TableHead>Mesor</TableHead>
          <TableHead>Amplitud</TableHead>
          <TableHead>Acrofase</TableHead>
          <TableHead>Hora pico</TableHead>
          <TableHead>MSE</TableHead>
          <TableHead>R²</TableHead>
          <TableHead>Chi²</TableHead>
          <TableHead>F-Statistic</TableHead>
          <TableHead>P-valor (F-test)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.group}>
            <TableCell>{row.group}</TableCell>
            <TableCell>{row.mesor?.toFixed(2)}</TableCell>
            <TableCell>{row.amplitude?.toFixed(2)}</TableCell>
            <TableCell>{row.acrophase?.toFixed(2)}</TableCell>
            <TableCell>{row.peak_time?.toFixed(2) ?? "-"}</TableCell>
            <TableCell>{row.mse?.toFixed(2) ?? "-"}</TableCell>
            <TableCell>{row.r2?.toFixed(2) ?? "-"}</TableCell>
            <TableCell>{row.chi2?.toFixed(2) ?? "-"}</TableCell>
            <TableCell>{row.f_statistic?.toFixed(2)}</TableCell>
            <TableCell>{row.p_value?.toExponential(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
