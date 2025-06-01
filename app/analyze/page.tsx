"use client";
import AnalyzeIntro from "@/components/AnalyzeIntro";
import FileDropZone from "@/components/FileDropZone";
import Footer from "@/components/footer/footer";
import React, { useState } from "react";

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result;
      if (data) {
        // Aquí puedes procesar los datos si lo necesitas
      }
    };
    reader.readAsArrayBuffer(selectedFile);
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
        />
      </main>
      <Footer />
    </div>
  );
}
