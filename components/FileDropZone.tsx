import React from "react";

interface FileDropZoneProps {
  fileName: string;
  selectedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProcess: () => void;
}

export default function FileDropZone({
  fileName,
  selectedFile,
  handleFileChange,
  handleProcess,
}: FileDropZoneProps) {
  return (
    <section className="max-w-3xl mx-auto">
      <div className="border-2 border-dashed border-blue-300 bg-white rounded-2xl shadow-lg p-10 text-center transition hover:shadow-2xl">
        <div className="flex flex-col items-center">
          <svg className="w-14 h-14 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <label htmlFor="excel-upload" className="mb-2 text-xl text-blue-900 font-semibold cursor-pointer hover:underline">
            Arrastra y suelta tu archivo o haz clic para seleccionar
          </label>
          <p className="text-sm text-gray-500 mb-4">Soporta archivos Excel (.xlsx, .xls)</p>
          <input
            title="Selecciona un archivo Excel para analizar"
            placeholder="Selecciona un archivo"
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => document.getElementById('excel-upload')?.click()}
            className="mt-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Seleccionar archivo
          </button>
          {fileName && (
            <div className="mt-4 text-green-700 font-medium bg-green-50 rounded px-3 py-1">
              Archivo seleccionado: {fileName}
            </div>
          )}
          {selectedFile && (
            <button
              onClick={handleProcess}
              className="mt-4 px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition-colors"
            >
              Procesar archivo
            </button>
          )}
        </div>
      </div>
    </section>
  );
} 