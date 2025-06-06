"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import Image from "next/image";

export default function OverviewPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  py-4 px-4">
      <Card className="w-full max-w-4xl shadow-lg border-blue-100 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-blue-800 drop-shadow mb-2 text-center">
            BioAnalyzer
          </CardTitle>
          <CardDescription className="text-lg text-gray-700 text-center">
            Plataforma web para el análisis de ritmos circadianos en parámetros
            biológicos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-gray-700 text-base leading-relaxed">
            <p className="mb-2">
              <strong>BioAnalyzer</strong> nace para satisfacer la necesidad de
              universidades y centros de investigación de contar con una
              herramienta web accesible, robusta y sin barreras técnicas para el
              análisis de ritmos circadianos. Permite analizar datos biológicos
              complejos de forma autónoma, sin requerir conocimientos avanzados
              de programación.
            </p>

            <p className="mb-2 italic text-blue-900">
              En los últimos años, ha crecido el interés dentro de la comunidad
              científica por desentrañar las complejidades de los ritmos
              biológicos (Figura 1), especialmente en el contexto de la salud
              humana (Figura 2). Se han reportado importantes implicaciones de
              la disrupción circadiana, vinculando esta desregulación con una
              variedad de trastornos, incluyendo alteraciones del sueño,
              trastornos metabólicos, complicaciones cardiovasculares y
              condiciones neuropsiquiátricas. Además, se ha descrito el papel de
              estas alteraciones en los patrones circadianos en la
              susceptibilidad a enfermedades y en las variaciones del
              rendimiento cognitivo.
            </p>
            <p className="mb-2">
              El análisis circadiano es fundamental para comprender la salud
              humana y la influencia de los ritmos biológicos en enfermedades,
              rendimiento cognitivo y susceptibilidad a trastornos. Sin embargo,
              la estadística de estos ritmos es un reto, y la mayoría de
              herramientas existentes requieren conocimientos técnicos o
              formatos de datos no unificados.
            </p>
            <p className="mb-2">
              <strong>BioAnalyzer</strong> elimina estas barreras, integrando en
              una sola plataforma todas las funcionalidades necesarias para el
              análisis circadiano, con una interfaz intuitiva y responsive.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col items-center">
              <Image
                src="/peripheral.png"
                alt="BioAnalyzer"
                width={500}
                height={500}
                className="w-full h-auto"
              />
              <span className="block text-xs text-gray-500 text-center mt-2 italic">
                Figure 1. Regulation of circadian rhythms.
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Image
                src="/analizer.png"
                alt="BioAnalyzer"
                width={500}
                height={500}
                className="w-full h-auto"
              />
              <span className="block text-xs text-gray-500 text-center mt-2 italic">
                Figure 2. Daily oscillations in human health conditions of
                hormones crucial for biological rhythms and food.
              </span>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-500 text-sm">
            © 2024 BioAnalyzer. Proyecto FCT - Desarrollo de Aplicaciones Web.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
