#!/bin/bash

# Activar el entorno virtual
source venv/bin/activate

# Instalar dependencias si es necesario
pip install -r requirements.txt

# Iniciar la aplicación Next.js
npm run dev 