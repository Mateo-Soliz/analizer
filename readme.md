├── app/ # Código principal de la aplicación Next.js (páginas, layouts, API, etc.)
├── components/ # Componentes reutilizables de React (tablas, formularios, gráficos, etc.)
├── hooks/ # Custom hooks de React para lógica reutilizable
├── lib/ # Librerías y utilidades compartidas (conexión a bases de datos, helpers, etc.)
├── modelos/ # Modelos de datos (vacío o para futuras implementaciones)
├── public/ # Archivos estáticos accesibles públicamente (imágenes, iconos, etc.)
├── utils/ # Utilidades y helpers generales
├── temp/ # Carpeta temporal (puede usarse para archivos generados o temporales)
```

```mermaid
erDiagram
    User ||--o{ DataSet : posee
    User ||--o{ ChartGallery : crea
    DataSet ||--o{ ChartGallery : "es fuente de"

    User {
        string name
        string email
        string phone
        string location
        date birthDate
        string gender
        string avatar
        boolean verified
        string uid
        string role
        date _createdAt
        date _updatedAt
    }
    DataSet {
        string name
        object data
        date _createdAt
        date _updatedAt
        owner User
    }
    ChartGallery {
        string title
        data DataSet
        string description
        owner User
        string type
        string xAxis
        string yAxis
        date date
        string category
        string[] tags
        number likes
        number views
        boolean isPublic
    }