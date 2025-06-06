"use client";
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
import { Badge, CheckCircle, FileText, Upload } from "lucide-react";
import { useState } from "react";

const AnalyzerPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    step: "upload" | "analysis" | null;
    message: string;
  }>({ step: null, message: "" });
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
      setError("Por favor, selecciona un archivo primero");
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress({ step: "upload", message: "Subiendo archivo..." });

    try {
      // 1. Subir el archivo
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Error al subir el archivo");
      }

      // Validar estructura de datos recibida
      if (
        !uploadData.data ||
        !uploadData.data.timePoints ||
        !uploadData.data.groups ||
        !uploadData.data.values
      ) {
        throw new Error("El archivo no tiene el formato esperado");
      }

      setUploadProgress({ step: "analysis", message: "Analizando datos..." });

      // 2. Analizar los datos
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData.data),
      });

      const analysisResults = await analyzeResponse.json();

      if (!analyzeResponse.ok) {
        throw new Error(analysisResults.error || "Error al analizar los datos");
      }

      // Validar resultados del análisis
      if (
        !analysisResults.circadian_analysis ||
        !analysisResults.mann_whitney_tests
      ) {
        throw new Error(
          "Los resultados del análisis no tienen el formato esperado"
        );
      }
      setPlotData(analysisResults.plot_data);
      setUploadProgress({ step: null, message: "¡Análisis completado!" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error en el proceso:", err);
    } finally {
      setIsLoading(false);
      setUploadProgress({ step: null, message: "" });
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
        <Graph data={plotData} fileName={uploadedFile?.name || ""} className="max-w-4xl mx-auto max-h-[600px]"  />
      )}
    </div>
  );
};
export default AnalyzerPage;
