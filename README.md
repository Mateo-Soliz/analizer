# CircAnalyst: Plataforma Web para el Análisis de Ritmos Circadianos

## 4.1 Introducción
CircAnalyst es una plataforma web diseñada para el análisis de ritmos circadianos, migrando la tecnología previamente desarrollada en Python a un entorno JavaScript. Su objetivo es ofrecer una herramienta accesible, intuitiva y potente para investigadores y empresas interesadas en el estudio de los ciclos biológicos de 24 horas, facilitando el análisis sin necesidad de conocimientos avanzados de programación.

## 4.2 Contexto
Los ritmos circadianos regulan procesos fisiológicos y conductuales en todos los organismos vivos. Factores modernos como el trabajo por turnos, la exposición a la luz artificial y los cambios en los hábitos de sueño pueden alterar estos ritmos, contribuyendo a trastornos del sueño, metabólicos, cardiovasculares y neuropsiquiátricos. El creciente interés científico y empresarial en este campo ha evidenciado la necesidad de herramientas accesibles para el análisis de la ritmicidad biológica.

## 4.3 Justificación y Motivación del Proyecto
Actualmente, la evaluación de la ritmicidad está limitada por la complejidad de los modelos estadísticos y la necesidad de conocimientos de programación. Existen paquetes en R y Python, pero suelen carecer de funcionalidades integradas y requieren formatos de datos no unificados. CircAnalyst surge para cubrir esta limitación, integrando todas las funcionalidades necesarias en una única plataforma web, con una interfaz amigable y sin requerir experiencia en programación.

## 4.4 Análisis y Diseño del Proyecto
- **Frontend:** JavaScript (React.js) para una experiencia de usuario moderna, interactiva y responsiva.
- **Backend:** Node.js y Express para la lógica de negocio y gestión de datos.
- **Análisis de datos:** Migración de algoritmos de análisis circadiano de Python a JavaScript, asegurando precisión y eficiencia.
- **Justificación:** La elección de JavaScript permite una mayor accesibilidad multiplataforma y facilita la integración web, eliminando barreras técnicas para los usuarios finales.

## 4.5 Desarrollo e Implementación
1. **Migración de algoritmos:** Conversión de scripts y funciones de análisis circadiano de Python a JavaScript.
2. **Diseño de la interfaz:** Creación de una UI intuitiva que permite cargar datos, seleccionar parámetros y visualizar resultados.
3. **Integración de funcionalidades:** Unificación de análisis, visualización y exportación de resultados en una sola herramienta.
4. **Pruebas y validación:** Comparación de resultados entre la versión original en Python y la nueva versión en JavaScript para garantizar la fiabilidad.

## 4.6 Despliegue y Publicación
- **Manual de usuario:**
  1. Accede a la plataforma web de CircAnalyst.
  2. Sube tus datos en el formato unificado.
  3. Selecciona los parámetros a analizar.
  4. Visualiza y exporta los resultados.
- **Enlace:** (Próximamente disponible tras el despliegue en la plataforma seleccionada)

## 4.7 Conclusiones y Valoración Personal
CircAnalyst representa un avance significativo en la accesibilidad y facilidad de uso para el análisis de ritmos circadianos. La migración a una plataforma web elimina barreras técnicas, permitiendo a un mayor número de investigadores y empresas beneficiarse de herramientas avanzadas sin requerir conocimientos de programación. Entre las principales dificultades se encontró la traducción precisa de algoritmos estadísticos de Python a JavaScript, resuelta mediante validaciones cruzadas y pruebas exhaustivas. Futuras mejoras incluyen la integración de nuevos métodos de análisis y la publicación de la plataforma como servicio SaaS.

## 4.8 Bibliografía y Recursos
- Time distributed data analysis by Cosinor.Online application. Lubos Molcan. (bioRxiv 805960; doi: https://doi.org/10.1101/805960)
- Gut microbiota and eating behaviour in circadian syndrome. Soliz-Rueda, Jorge R. et al. Trends in Endocrinology & Metabolism, Volume 36, Issue 1, 15 – 28.
