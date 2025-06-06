"use client";
import { CircadianAnalysisResults } from "@/app/(page)/analyze/page";
import AnalysisTable from "@/components/AnalysisTable";
import Graph from "@/components/graph";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Input } from "@/components/primitives/input";
import { useFileAnalysis } from "@/hooks/useFileAnalysis";
import { getTableData } from "@/lib/server-only/analyzer/analizer.mapper";
import { Badge, CheckCircle, FileText, Upload } from "lucide-react";
import { useState } from "react";

const AnalyzerPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] =
    useState<CircadianAnalysisResults | null>(null);
  const { analyzeFile, isLoading, error, uploadProgress } = useFileAnalysis();

  const [plotData, setPlotData] = useState<any>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleProcessData = async () => {
    if (!uploadedFile) {
      return;
    }
    try {
      const results = await analyzeFile(uploadedFile);
      setPlotData(results.plot_data);
      setAnalysisResults(results);
    } catch (err) {
      console.error("Error en el proceso:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Archivo de Datos
          </CardTitle>
          <CardDescription>
            Sube archivos CSV con tus datos de ritmos circadianos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Área de drag & drop */}
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Arrastra tu archivo aquí</p>
              <p className="text-sm text-muted-foreground">
                o haz clic para seleccionar
              </p>
            </div>
            <Input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              className="mt-4 max-w-xs mx-auto"
            />
          </div>

          {/* Archivo subido */}
          {uploadedFile && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge>
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Listo
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <Button
                className="mx-10"
                onClick={handleProcessData}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Procesar Datos"}
              </Button>
            </Card>
          )}

          {/* Mostrar progreso */}
          {isLoading && uploadProgress.step && (
            <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-md">
              {uploadProgress.message}
            </div>
          )}

          {/* Mostrar errores */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Formatos soportados */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-2 text-center">
                <FileText className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <p className="font-medium">Excel</p>
                <p className="text-xs text-muted-foreground">Archivos .xlsx</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-2 text-center">
                <FileText className="h-6 w-6 mx-auto text-green-600 mb-2 opacity-50" />
                <p className="font-medium">CSV</p>
                <p className="text-xs text-muted-foreground">
                  Datos separados por comas (próximamente)
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-2 text-center">
                <FileText className="h-6 w-6 mx-auto text-purple-600 mb-2 opacity-50" />
                <p className="font-medium">JSON</p>
                <p className="text-xs text-muted-foreground">
                  Datos estructurados (próximamente)
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      {plotData && (
        <div className="flex flex-col gap-4">
          <Graph
            data={plotData}
            fileName={uploadedFile?.name || ""}
            className="max-w-7xl max-h-[700px] mx-auto"
          />
          <AnalysisTable
            data={getTableData(analysisResults as CircadianAnalysisResults)}
          />
        </div>
      )}
    </div>
  );
};
export default AnalyzerPage;
