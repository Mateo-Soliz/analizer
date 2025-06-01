'use client';

import { useState } from 'react';

export default function AnalyzerForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Leer el archivo Excel
      const formData = new FormData();
      formData.append('file', file);

      // Primero subir el archivo
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Error al subir el archivo');
      }

      const { data } = await uploadResponse.json();

      // Luego analizar los datos
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!analyzeResponse.ok) {
        throw new Error('Error en el análisis');
      }

      const results = await analyzeResponse.json();
      setResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="excel-file" className="block text-sm font-medium text-gray-700">
            Archivo Excel
          </label>
          <input
            id="excel-file"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="mt-1 block w-full"
            aria-label="Seleccionar archivo Excel"
          />
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Analizando...' : 'Analizar'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {results && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Resultados</h2>
          
          {/* Mostrar la gráfica */}
          {results.graph && (
            <div className="mb-6">
              <img
                src={`data:image/png;base64,${results.graph}`}
                alt="Gráfica de análisis"
                className="max-w-full"
              />
            </div>
          )}

          {/* Mostrar resultados numéricos */}
          <div className="space-y-4">
            {Object.entries(results.results).map(([group, data]: [string, any]) => (
              <div key={group} className="border p-4 rounded">
                <h3 className="font-bold">{group}</h3>
                {data.error ? (
                  <p className="text-red-600">{data.error}</p>
                ) : (
                  <dl className="grid grid-cols-2 gap-2">
                    <dt>Mesor:</dt>
                    <dd>{data.mesor.toFixed(2)}</dd>
                    <dt>Amplitud:</dt>
                    <dd>{data.amplitude.toFixed(2)}</dd>
                    <dt>Acrofase:</dt>
                    <dd>{data.acrophase.toFixed(2)} horas</dd>
                    <dt>F-estadístico:</dt>
                    <dd>{data.f_statistic.toFixed(2)}</dd>
                    <dt>P-valor:</dt>
                    <dd>{data.p_value.toFixed(4)}</dd>
                  </dl>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 