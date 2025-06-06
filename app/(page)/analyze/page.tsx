"use client";
import AnalysisTable from "@/components/AnalysisTable";
import AnalyzeIntro from "@/components/AnalyzeIntro";
import FileDropZone from "@/components/FileDropZone";
import Footer from "@/components/footer/footer";
import Graph from "@/components/graph";
import { useFileAnalysis } from "@/hooks/useFileAnalysis";
import { getTableData } from "@/lib/server-only/analyzer/analizer.mapper";
import React, { useState } from "react";

export interface CircadianGroupResult {
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

export interface CircadianAnalysisResults {
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
  const { analyzeFile, isLoading, error, uploadProgress } = useFileAnalysis();
  const [analysisResults, setAnalysisResults] =
    useState<CircadianAnalysisResults | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const validateExcelFile = (file: File): boolean => {
    // Validar extensión
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));

    if (!validExtensions.includes(fileExtension)) {
      return false;
    }

    // Validar tamaño (por ejemplo, máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
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
      } else {
        e.target.value = ""; // Limpiar el input
        setSelectedFile(null);
        setFileName("");
      }
    }
  };

  const handleProcessData = async () => {
    if (!selectedFile) {
      return;
    }
    try {
      const results = await analyzeFile(selectedFile);
      setPlotData(results.plot_data);
      setAnalysisResults(results);
    } catch (err) {
      console.error("Error en el proceso:", err);
    }
  };
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <AnalyzeIntro />
        <FileDropZone
          fileName={fileName}
          selectedFile={selectedFile}
          handleFileChange={handleFileChange}
          handleProcess={handleProcessData}
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
          <div className="flex flex-col gap-4">
            <Graph data={plotData} fileName={fileName} />
            <AnalysisTable
              data={getTableData(analysisResults as CircadianAnalysisResults)}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
