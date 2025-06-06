import { useState } from "react";

export function useFileAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ step: "upload" | "analysis" | null; message: string }>({ step: null, message: "" });

  const analyzeFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setUploadProgress({ step: "upload", message: "Subiendo archivo..." });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) throw new Error(uploadData.error || "Error al subir el archivo");

      if (!uploadData.data || !uploadData.data.timePoints || !uploadData.data.groups || !uploadData.data.values) {
        throw new Error("El archivo no tiene el formato esperado");
      }

      setUploadProgress({ step: "analysis", message: "Analizando datos..." });

      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadData.data),
      });

      const analysisResults = await analyzeResponse.json();

      if (!analyzeResponse.ok) throw new Error(analysisResults.error || "Error al analizar los datos");

      if (!analysisResults.circadian_analysis || !analysisResults.mann_whitney_tests) {
        throw new Error("Los resultados del análisis no tienen el formato esperado");
      }

      setUploadProgress({ step: null, message: "¡Análisis completado!" });
      return analysisResults;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setIsLoading(false);
      setUploadProgress({ step: null, message: "" });
    }
  };

  return { analyzeFile, isLoading, error, uploadProgress };
}
