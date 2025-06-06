"use client";
import { cn } from "@/utils/cn.utils";
import {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  registerables,
} from "chart.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Scatter } from "react-chartjs-2";
import MenuConfig from "./menu-config";

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
  fileName: string;
  className?: string;
}

const defaultColors = [
  "#36A2EB",
  "#FF6384",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#646464",
  "#000000",
];

function getRandomColor() {
  // Genera un color hexadecimal aleatorio
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

const Graph = ({ data: initialData, fileName, className }: GraphProps) => {
  const [plotData, setPlotData] = useState<PlotData | null>(initialData);
  const [error, setError] = useState<string | null>(null);

  // Estado para configuración de ejes
  const [axisConfig, setAxisConfig] = useState({
    x: { title: "Time point (ZT)", min: 0, max: 24 },
    y: { title: "Valor", min: undefined, max: undefined },
  });

  // Estado para colores de cada grupo
  const [colorConfig, setColorConfig] = useState<Record<string, string>>({});

  // Inicializar colores para cada grupo si no existen
  useEffect(() => {
    if (plotData) {
      setColorConfig((prev) => {
        const newConfig = { ...prev };
        Object.keys(plotData.groups).forEach((group, idx) => {
          if (!newConfig[group]) {
            // Usa color por defecto o random si se acaban
            newConfig[group] = defaultColors[idx] || getRandomColor();
          }
        });
        return newConfig;
      });
    }
  }, [plotData]);

  // Handler para cambios en los ejes
  const handleAxisChange = (axis: "x" | "y", field: string, value: string) => {
    setAxisConfig((prev) => ({
      ...prev,
      [axis]: {
        ...prev[axis],
        [field]:
          field === "min" || field === "max"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
      },
    }));
  };

  // Handler para cambios de color
  const handleColorChange = (group: string, color: string) => {
    setColorConfig((prev) => ({ ...prev, [group]: color }));
  };

  useEffect(() => {
    setPlotData(initialData);
  }, [initialData]);

  const createDataset = useCallback(
    (group: string, groupData: GroupData, color: string) => {
      const datasets: ChartDataset<"scatter", { x: number; y: number }[]>[] =
        [];

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
          data: groupData.fitted_curve.time_points.map(
            (t: number, i: number) => ({
              x: t,
              y: groupData.fitted_curve!.values[i],
            })
          ),
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
    },
    []
  );

  const chartData = useMemo((): ChartData<"scatter"> => {
    if (!plotData) return { datasets: [] };

    const datasets = Object.entries(plotData.groups).flatMap(
      ([group, groupData], idx) => {
        const color =
          colorConfig[group] || defaultColors[idx] || getRandomColor();
        return createDataset(group, groupData, color);
      }
    );

    return { datasets };
  }, [plotData, createDataset, colorConfig]);

  const options: ChartOptions<"scatter"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750,
        easing: "easeInOutQuart",
      },
      plugins: {
        legend: {
          position: "left",
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
            },
          },
        },
        title: {
          display: true,
          text: `Oscilación circadiana de ${fileName.split("_")[0]}`,
          font: {
            size: 16,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#000",
          bodyColor: "#666",
          borderColor: "#ddd",
          borderWidth: 1,
          padding: 10,
          boxPadding: 5,
        },
      },
      scales: {
        x: {
          type: "linear" as const,
          title: {
            display: true,
            text: axisConfig.x.title,
            font: {
              weight: "bold",
            },
          },
          min: axisConfig.x.min,
          max: axisConfig.x.max,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        y: {
          title: {
            display: true,
            text: axisConfig.y.title,
            font: {
              weight: "bold",
            },
          },
          min: axisConfig.y.min,
          max: axisConfig.y.max,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
    }),
    [fileName, axisConfig]
  );

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
    <div
      className={cn(
        "w-full p-4 bg-white rounded-lg shadow-lg flex flex-row gap-6 items-stretch",
        className
      )}
    >
      {/* Gráfica */}
      <div className="flex-1 flex items-stretch">
        <div className="w-full h-full min-h-[500px]">
          <Scatter data={chartData} options={options} height={500} />
        </div>
      </div>
      {/* Menú de configuración */}
      <MenuConfig
        axisConfig={axisConfig}
        handleAxisChange={handleAxisChange}
        colorConfig={colorConfig}
        handleColorChange={handleColorChange}
        fileName={fileName}
        plotData={plotData}
        defaultColors={defaultColors}
      />
    </div>
  );
};

export default Graph;
