"use client";
import { Chart, ChartData, ChartDataset, ChartOptions, registerables } from "chart.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Scatter } from "react-chartjs-2";

Chart.register(...registerables);

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

interface GraphProps {
  data: PlotData;
}

const colores = [
  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 99, 132, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(153, 102, 255, 0.8)",
  "rgba(255, 159, 64, 0.8)",
  "rgba(100, 100, 100, 0.8)",
  "rgba(0, 0, 0, 0.8)",
];

const Graph = ({ data: initialData }: GraphProps) => {
  const [plotData, setPlotData] = useState<PlotData | null>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const analysisResults = localStorage.getItem("analysisResults");
      if (analysisResults) {
        const parsed = JSON.parse(analysisResults);
        if (parsed.plot_data) {
          setPlotData(parsed.plot_data);
        }
      }
    } catch (err) {
      setError("Error al cargar los datos de la gráfica");
      console.error("Error loading plot data:", err);
    }
  }, []);

  const createDataset = useCallback((group: string, groupData: GroupData, color: string) => {
    const datasets: ChartDataset<"scatter", { x: number; y: number }[]>[] = [];

    // Dataset para puntos individuales
    datasets.push({
      label: `${group} (puntos)`,
      data: groupData.raw_data.time_points.map((t: number, i: number) => ({
        x: t,
        y: groupData.raw_data.values[i],
      })),
      backgroundColor: color,
      showLine: false,
      pointRadius: 5,
    });

    // Dataset para curva ajustada
    if (groupData.fitted_curve) {
      datasets.push({
        label: `${group} (ajuste)`,
        data: groupData.fitted_curve.time_points.map((t: number, i: number) => ({
          x: t,
          y: groupData.fitted_curve!.values[i],
        })),
        borderColor: color,
        backgroundColor: "rgba(0,0,0,0)",
        showLine: true,
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.4,
      });
    }

    return datasets;
  }, []);

  const chartData = useMemo((): ChartData<"scatter"> => {
    if (!plotData) return { datasets: [] };

    const datasets = Object.entries(plotData.groups).flatMap(([group, groupData], idx) => {
      const color = colores[idx % colores.length];
      return createDataset(group, groupData, color);
    });

    return { datasets };
  }, [plotData, createDataset]);

  const options: ChartOptions<"scatter"> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: "Oscilación circadiana (Scatter + Ajuste)",
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5
      }
    },
    scales: {
      x: {
        type: "linear" as const,
        title: {
          display: true,
          text: "Time point (ZT)",
          font: {
            weight: 'bold'
          }
        },
        min: 0,
        max: 24,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: "Valor",
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }), []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!plotData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="animate-pulse text-gray-600">Cargando gráfica...</div>
      </div>
    );
  }
  console.log("chartData", JSON.stringify(initialData, null, 2));
  return (
    <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-lg">
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default Graph;