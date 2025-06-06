"use client";
import { AnalizerCard } from "@/components/cards/analizer-card";
import { Button } from "@/components/primitives/button";
import { BarChart3, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

const chartGallery = [
  {
    id: 1,
    title: "Patrón de Sueño vs Calidad",
    description: "Correlación entre horas de sueño y calidad percibida",
    type: "scatter",
    xAxis: "Horas de Sueño",
    yAxis: "Calidad (1-10)",
    date: "15 Feb 2024",
    category: "Sueño",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["sueño", "calidad", "correlación"],
    likes: 12,
    views: 45,
    isPublic: true,
  },
  {
    id: 2,
    title: "Ritmo Circadiano Semanal",
    description: "Temperatura corporal a lo largo de la semana",
    type: "line",
    xAxis: "Hora del Día",
    yAxis: "Temperatura (°C)",
    date: "12 Feb 2024",
    category: "Temperatura",
    thumbnail: "/placeholder.svg?height=200&width=300",
    tags: ["temperatura", "circadiano", "semanal"],
    likes: 8,
    views: 32,
    isPublic: false,
  },
];

const MyAnalysesPage = () => {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mis Gráficas de Análisis</h1>
          <p className="text-muted-foreground">
            Galería de gráficas de ritmos circadianos creadas por ti
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 ">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button onClick={() => router.push("/analyzer")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Nueva Gráfica
          </Button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {chartGallery.map((chart) => (
          <AnalizerCard key={chart.id} chart={chart} />
        ))}
      </div>
    </div>
  );
};

export default MyAnalysesPage;
