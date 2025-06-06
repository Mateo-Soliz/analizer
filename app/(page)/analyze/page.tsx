"use client";
import AnalysisTable from "@/components/AnalysisTable";
import AnalyzeIntro from "@/components/AnalyzeIntro";
import FileDropZone from "@/components/FileDropZone";
import Footer from "@/components/footer/footer";
import Graph from "@/components/graph";
import React, { useState } from "react";

interface CircadianGroupResult {
  mesor: number;
  amplitude: number;
  acrophase: number;
  acrophase_rad: number;
  peak_time: number;
  mse: number;
  r2: number;
  chi2: number;
  f_statistic: number;
  p_value: number;
}

interface CircadianAnalysisResults {
  circadian_analysis: Record<string, CircadianGroupResult>;
  mann_whitney_tests?: unknown;
  plot_data?: unknown;
}

// Definir el tipo PlotData exactamente como en Graph
interface GroupData {
  raw_data: {
    time_points: number[];
    values: number[];
  };
  fitted_curve?: {
    time_points: number[];
    values: number[];
  };
}

interface PlotData {
  groups: Record<string, GroupData>;
}

export default function AnalyzePage() {
  const [plotData, setPlotData] = useState<PlotData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    step: "upload" | "analysis" | null;
    message: string;
  }>({ step: null, message: "" });

  const validateExcelFile = (file: File): boolean => {
    // Validar extensión
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));

    if (!validExtensions.includes(fileExtension)) {
      setError("El archivo debe ser un Excel (.xlsx o .xls)");
      return false;
    }

    // Validar tamaño (por ejemplo, máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      setError("El archivo es demasiado grande. Tamaño máximo: 10MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateExcelFile(file)) {
        setSelectedFile(file);
        setFileName(file.name);
        setError(null);
      } else {
        e.target.value = ""; // Limpiar el input
        setSelectedFile(null);
        setFileName("");
      }
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      setError("Por favor, selecciona un archivo primero");
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadProgress({ step: "upload", message: "Subiendo archivo..." });

    try {
      // 1. Subir el archivo
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log("uploadResponse", JSON.stringify(uploadResponse, null, 2));
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

      // 4. Redirigir a la página de resultados
      setPlotData(analysisResults.plot_data as PlotData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error en el proceso:", err);
    } finally {
      setIsLoading(false);
      setUploadProgress({ step: null, message: "" });
    }
  };

  const getTableData = (analysisResults: CircadianAnalysisResults) => {
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
  };

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <AnalyzeIntro />
        <FileDropZone
          fileName={fileName}
          selectedFile={selectedFile}
          handleFileChange={handleFileChange}
          handleProcess={handleProcess}
          isLoading={isLoading}
        />

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

        {/* Información sobre el archivo */}
        {selectedFile && !isLoading && !error && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
            <p className="font-semibold">Archivo seleccionado:</p>
            <p>{fileName}</p>
            <p className="text-sm mt-2">
              Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        {plotData && (
          <>
            <Graph data={plotData} fileName={fileName} />
            <AnalysisTable
              data={getTableData(
                JSON.parse(
                  localStorage.getItem("analysisResults") || "{}"
                ) as CircadianAnalysisResults
              )}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
