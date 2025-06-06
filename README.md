# BioAnalyzer: Plataforma Web para el Análisis de Ritmos Circadianos

## Descripción Breve del Proyecto
BioAnalyzer es una plataforma web desarrollada para facilitar el análisis de ritmos circadianos en parámetros biológicos, orientada a cubrir una necesidad real detectada en universidades y centros de investigación. El proyecto surge como respuesta a la demanda de herramientas accesibles, intuitivas y potentes que permitan realizar análisis circadianos avanzados sin requerir conocimientos de programación, eliminando así barreras técnicas y económicas para la investigación biomédica.

---

## Índice
1. [Introducción y Motivación](#introducción-y-motivación)
2. [Contexto y Entorno de Desarrollo](#contexto-y-entorno-de-desarrollo)
3. [Justificación de la Elección del Proyecto](#justificación-de-la-elección-del-proyecto)
4. [Análisis y Diseño del Proyecto](#análisis-y-diseño-del-proyecto)
5. [Desarrollo e Implementación](#desarrollo-e-implementación)
6. [Despliegue y Manual de Usuario](#despliegue-y-manual-de-usuario)
7. [Conclusiones](#conclusiones)
8. [Bibliografía y Recursos](#bibliografía-y-recursos)

---

## Introducción y Motivación
BioAnalyzer nace para satisfacer una necesidad concreta de universidades y centros de investigación: disponer de una herramienta web que permita analizar ritmos circadianos de forma sencilla, robusta y sin depender de conocimientos avanzados de programación. El objetivo es democratizar el acceso a la ritmometría, permitiendo a equipos multidisciplinares analizar datos biológicos complejos de manera autónoma y eficiente.

## Contexto y Entorno de Desarrollo
El desarrollo de BioAnalyzer se enmarca en el creciente interés por el estudio de los ritmos circadianos y su impacto en la salud humana. Factores como el trabajo por turnos, la exposición a la luz artificial y los cambios en los hábitos de vida han incrementado la demanda de herramientas de análisis circadiano en entornos académicos y clínicos. La plataforma se desarrolla en un entorno web moderno, utilizando tecnologías multiplataforma para garantizar accesibilidad desde cualquier dispositivo y facilitar la colaboración entre investigadores.

## Justificación de la Elección del Proyecto
La elección de este proyecto responde a su carácter innovador y a la carencia de soluciones integrales en el sector. Aunque existen varios paquetes y librerías en R o Python para la ritmometría basada en cosenos, la mayoría carecen de funcionalidades completas, obligando a combinar múltiples herramientas y a trabajar con formatos de datos no unificados. Incluso los paquetes más avanzados, como CosinorPy o Kronos, requieren conocimientos de programación o la contratación de personal bioinformático. BioAnalyzer cubre esta limitación ofreciendo una plataforma web unificada, accesible y sin necesidad de programación, lo que supone un avance disruptivo en el sector.

## Análisis y Diseño del Proyecto
- **Frontend:** React.js para una interfaz moderna, interactiva y responsiva.
- **Backend:** Node.js y Express para la lógica de negocio, gestión de usuarios y procesamiento de datos.
- **Frameworks y librerías CSS:** Tailwind CSS para el diseño visual y la responsividad.
- **Librerías adicionales:** Chart.js para la visualización de datos, JWT para autenticación segura, y Multer para la gestión de archivos.
- **Análisis de datos:** Migración e integración de algoritmos de análisis circadiano provenientes de entornos universitarios, adaptados a JavaScript para su ejecución en el backend.

## Desarrollo e Implementación
El desarrollo de BioAnalyzer se centra en tres pilares fundamentales:
1. **Middleware y autenticación:** Implementación de un sistema de autenticación robusto basado en JWT, con middleware personalizado para la protección de rutas y la gestión de sesiones de usuario.
2. **Backend y análisis de datos:** Integración de algoritmos de análisis circadiano validados en entornos universitarios, permitiendo el procesamiento seguro y eficiente de los datos subidos por los usuarios.
3. **Integración con la app:** El backend expone una API RESTful que permite a la aplicación web interactuar con los algoritmos de análisis, gestionar usuarios y almacenar resultados, garantizando la escalabilidad y la seguridad de la plataforma.

## Despliegue y Manual de Usuario
### Despliegue
BioAnalyzer puede desplegarse en cualquier servidor compatible con Node.js. Se recomienda el uso de servicios como Heroku, Vercel o servidores propios para entornos de producción.

### Manual de Usuario (Guía Paso a Paso)
1. **Registro e inicio de sesión:**
   - Accede a la web y crea una cuenta de usuario.
   - Inicia sesión con tus credenciales.
2. **Carga de datos:**
   - Sube tus archivos de datos en formato CSV, Excel u otro formato soportado.
   - El sistema validará el formato y te permitirá seleccionar los parámetros a analizar.
3. **Configuración del análisis:**
   - Elige el tipo de análisis circadiano y los parámetros específicos según tus necesidades.
4. **Ejecución y visualización:**
   - Inicia el análisis y visualiza los resultados en gráficos interactivos y tablas.
   - Puedes comparar diferentes grupos o parámetros y exportar los resultados en PDF, CSV o imagen.
5. **Gestión de resultados:**
   - Accede a tu historial de análisis, descarga informes y comparte resultados con tu equipo.

## Conclusiones
BioAnalyzer representa una solución innovadora y necesaria para el análisis de ritmos circadianos en entornos académicos y de investigación. Su desarrollo ha supuesto un reto técnico y científico, especialmente en la integración de algoritmos avanzados y la implementación de un sistema de autenticación seguro. El resultado es una plataforma accesible, robusta y escalable, que elimina barreras técnicas y facilita la investigación multidisciplinar. Futuras mejoras incluyen la integración de nuevos métodos de análisis, la internacionalización y la publicación como servicio SaaS.

## Bibliografía y Recursos
- Time distributed data analysis by Cosinor.Online application. Lubos Molcan. (bioRxiv 805960; doi: https://doi.org/10.1101/805960)
- Gut microbiota and eating behaviour in circadian syndrome. Soliz-Rueda, Jorge R. et al. Trends in Endocrinology & Metabolism, Volume 36, Issue 1, 15 – 28.
- Refining the cosinor model for the analysis of biological rhythms: An overview. Refinetti, R. (2016). Journal of Circadian Rhythms.
- Documentación oficial de React.js, Node.js, Express y Tailwind CSS.
- Manuales y artículos sobre análisis circadiano en biomedicina.

---

© 2024 BioAnalyzer. Proyecto FCT - Desarrollo de Aplicaciones Web.
