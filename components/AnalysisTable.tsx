"use client";

import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import { Input } from "@/components/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import {
  ArrowUpDown,
  Copy,
  Download,
  Filter,
  Info,
  MoreHorizontal,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

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
  title?: string;
  description?: string;
}

type SortField = keyof GroupAnalysis;
type SortDirection = "asc" | "desc";

export default function AnalysisTable({
  data,
  title = "Análisis de Ritmos Circadianos",
  description = "Resultados del análisis cosinor por grupos",
}: AnalysisTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("group");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterSignificant, setFilterSignificant] = useState<string>("all");

  // Función para determinar significancia estadística
  const getSignificanceBadge = (pValue: number) => {
    if (pValue < 0.001) {
      return (
        <Badge variant="default" className="bg-green-600">
          ***
        </Badge>
      );
    } else if (pValue < 0.01) {
      return (
        <Badge variant="default" className="bg-green-500">
          **
        </Badge>
      );
    } else if (pValue < 0.05) {
      return (
        <Badge variant="default" className="bg-yellow-500">
          *
        </Badge>
      );
    } else {
      return <Badge variant="secondary">ns</Badge>;
    }
  };

  // Función para formatear la hora pico
  const formatPeakTime = (peakTime?: number) => {
    if (!peakTime) return "-";
    const hours = Math.floor(peakTime);
    const minutes = Math.round((peakTime - hours) * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Función para obtener color basado en R²
  const getR2Color = (r2?: number) => {
    if (!r2) return "text-gray-500";
    if (r2 >= 0.8) return "text-green-600";
    if (r2 >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  // Función para ordenar datos
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtrar y ordenar datos
  const filteredAndSortedData = data
    .filter((row) => {
      const matchesSearch = row.group
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterSignificant === "all" ||
        (filterSignificant === "significant" && row.p_value < 0.05) ||
        (filterSignificant === "non-significant" && row.p_value >= 0.05);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  // Estadísticas resumen
  const significantCount = data.filter((row) => row.p_value < 0.05).length;
  const avgR2 = data.reduce((sum, row) => sum + (row.r2 || 0), 0) / data.length;
  const avgAmplitude =
    data.reduce((sum, row) => sum + row.amplitude, 0) / data.length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportData = () => {
    const csv = [
      [
        "Grupo",
        "Mesor",
        "Amplitud",
        "Acrofase",
        "Hora Pico",
        "MSE",
        "R²",
        "Chi²",
        "F-Statistic",
        "P-valor",
      ],
      ...filteredAndSortedData.map((row) => [
        row.group,
        row.mesor?.toFixed(2),
        row.amplitude?.toFixed(2),
        row.acrophase?.toFixed(2),
        row.peak_time?.toFixed(2) ?? "-",
        row.mse?.toFixed(2) ?? "-",
        row.r2?.toFixed(2) ?? "-",
        row.chi2?.toFixed(2) ?? "-",
        row.f_statistic?.toFixed(2),
        row.p_value?.toExponential(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analisis_circadiano.csv";
    a.click();
  };

  const exportRow = (row: GroupAnalysis) => {
    const csv = [
      [
        "Grupo",
        "Mesor",
        "Amplitud",
        "Acrofase",
        "Hora Pico",
        "MSE",
        "R²",
        "Chi²",
        "F-Statistic",
        "P-valor",
      ],
      [
        row.group,
        row.mesor?.toFixed(2),
        row.amplitude?.toFixed(2),
        row.acrophase?.toFixed(2),
        row.peak_time?.toFixed(2) ?? "-",
        row.mse?.toFixed(2) ?? "-",
        row.r2?.toFixed(2) ?? "-",
        row.chi2?.toFixed(2) ?? "-",
        row.f_statistic?.toFixed(2),
        row.p_value?.toExponential(2),
      ],
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grupo_${row.group}_analisis_circadiano.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <Button onClick={exportData} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Grupos</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {significantCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Significativos (p&lt;0.05)
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {avgR2.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">R² Promedio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de filtrado y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar grupos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterSignificant}
              onValueChange={setFilterSignificant}
            >
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los grupos</SelectItem>
                <SelectItem value="significant">Solo significativos</SelectItem>
                <SelectItem value="non-significant">
                  No significativos
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla principal */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("group")}
                      className="h-auto p-0 font-semibold"
                    >
                      Grupo
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("mesor")}
                            className="h-auto p-0 font-semibold"
                          >
                            Mesor
                            <Info className="ml-1 h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Valor medio del ritmo (nivel basal)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("amplitude")}
                            className="h-auto p-0 font-semibold"
                          >
                            Amplitud
                            <Info className="ml-1 h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Magnitud de la oscilación</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("acrophase")}
                            className="h-auto p-0 font-semibold"
                          >
                            Acrofase
                            <Info className="ml-1 h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fase del pico (en radianes)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>Hora Pico</TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("r2")}
                            className="h-auto p-0 font-semibold"
                          >
                            R²
                            <Info className="ml-1 h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Coeficiente de determinación (bondad de ajuste)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("p_value")}
                      className="h-auto p-0 font-semibold"
                    >
                      Significancia
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((row) => (
                  <TableRow key={row.group} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{row.group}</TableCell>
                    <TableCell>{row.mesor?.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {row.amplitude?.toFixed(2)}
                        {row.amplitude > avgAmplitude ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{row.acrophase?.toFixed(2)}</TableCell>
                    <TableCell className="font-mono">
                      {formatPeakTime(row.peak_time)}
                    </TableCell>
                    <TableCell>
                      <span className={getR2Color(row.r2)}>
                        {row.r2?.toFixed(3) ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSignificanceBadge(row.p_value)}
                        <span className="text-xs text-muted-foreground">
                          {row.p_value?.toExponential(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => copyToClipboard(row.group)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar grupo
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => exportRow(row)}>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar fila
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No se encontraron resultados
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leyenda de significancia */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium">
              Leyenda de significancia:
            </span>
            <div className="flex items-center gap-1">
              <Badge variant="default" className="bg-green-600">
                ***
              </Badge>
              <span className="text-xs">p &lt; 0.001</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="default" className="bg-green-500">
                **
              </Badge>
              <span className="text-xs">p &lt; 0.01</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="default" className="bg-yellow-500">
                *
              </Badge>
              <span className="text-xs">p &lt; 0.05</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="secondary">ns</Badge>
              <span className="text-xs">no significativo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
