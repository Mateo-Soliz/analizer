"use client";
import { AnalizerCard } from "@/components/cards/analizer-card";
import { Button } from "@/components/primitives/button";
import { useUserStore } from "@/lib/client-only/stores/user/user.store";
import { getGallery } from "@/lib/server-only/data-set/data.service";
import { ChartGalleryType } from "@/lib/server-only/data-set/data.type";
import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyAnalysesPage = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const [gallery, setGallery] = useState<ChartGalleryType[]>([]);
  useEffect(() => {
    if (!user?.id && !user?._id) return;
    const fetchGallery = async () => {
      const gallery = await getGallery(user?.id ?? user?._id);
      setGallery(gallery);
    };
    fetchGallery();
  }, [user, user?._id]);
  console.log(gallery);
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
          <Button onClick={() => router.push("/analyzer")}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Nueva Gráfica
          </Button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gallery.length > 0 ? (
          gallery.map((chart) => (
            <AnalizerCard key={chart.id } chart={chart} />
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">No hay gráficas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAnalysesPage;
