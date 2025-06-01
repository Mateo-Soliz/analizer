
export default function AnalyzeIntro() {
  return (
    <section className="max-w-3xl mx-auto mb-10">
      <h1 className="text-3xl font-extrabold mb-4 text-blue-800 drop-shadow">Análisis Circadiano</h1>
      <div className="text-gray-700 text-lg bg-white rounded-xl shadow p-6 border border-blue-100">
        <p className="mb-2">
          Bienvenido a la herramienta de análisis circadiano. Aquí podrás subir tus datos en formato Excel (.xlsx o .xls) para realizar un análisis automático de ritmos circadianos.
        </p>
        <p className="mb-2">
          Una vez subidos los datos, se generarán automáticamente los análisis y gráficos correspondientes. Recibirás tanto los resultados numéricos como representaciones visuales de tus datos.
        </p>
        <p>
          Además, tendrás la opción de personalizar los gráficos según tus necesidades: podrás cambiar los nombres de los ejes, ajustar los valores máximos y mínimos, y modificar otros aspectos visuales para adaptar la presentación a tus preferencias o requerimientos de publicación.
        </p>
      </div>
    </section>
  );
} 