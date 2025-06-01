import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Una herramienta rápida y precisa para el análisis de datos biomédicos
        </h1>
        <p className="text-xl text-gray-600">
          Analiza tus datos biomédicos de manera eficiente y obtén resultados
          precisos en tiempo real
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Analizar sin registrarse
          </Link>
        </div>
      </div>
    </section>
  );
}
