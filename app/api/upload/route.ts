import { spawn } from 'child_process';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar que sea un archivo Excel
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'El archivo debe ser un Excel (.xlsx o .xls)' },
        { status: 400 }
      );
    }

    // Crear directorio temporal si no existe
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Guardar archivo temporalmente
    const tempPath = path.join(tempDir, file.name);
    const bytes = await file.arrayBuffer();
    fs.writeFileSync(tempPath, Buffer.from(bytes));

    // Crear script Python para validar y leer el Excel
    const scriptPath = path.join(tempDir, 'validate_excel.py');
    const scriptContent = `
import pandas as pd
import json
import sys

try:
    # Leer archivo Excel
    df = pd.read_excel('${tempPath}')
    
    # Validar estructura del archivo
    if 'Time point' not in df.columns:
        print(json.dumps({'error': 'El archivo debe contener una columna "Time point"'}))
        sys.exit(1)
        
    if len(df.columns) < 2:
        print(json.dumps({'error': 'El archivo debe contener al menos una columna de datos además de "Time point"'}))
        sys.exit(1)
    
    # Validar datos
    if df['Time point'].isnull().any():
        print(json.dumps({'error': 'La columna "Time point" no puede contener valores nulos'}))
        sys.exit(1)
    
    # Convertir a formato JSON
    data = {
        'timePoints': df['Time point'].tolist(),
        'groups': [col for col in df.columns if col != 'Time point'],
        'values': [df[col].tolist() for col in df.columns if col != 'Time point']
    }
    
    print(json.dumps({'data': data}))
    
except Exception as e:
    print(json.dumps({'error': f'Error al procesar el archivo: {str(e)}'}))
    sys.exit(1)
`;

    fs.writeFileSync(scriptPath, scriptContent);

    // Ejecutar script Python
    return await new Promise<Response>((resolve, reject) => {
      const pythonProcess = spawn('python3', [scriptPath]);
      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        // Limpiar archivos temporales
        fs.unlinkSync(tempPath);
        fs.unlinkSync(scriptPath);

        if (code !== 0) {
          reject(NextResponse.json(
            { error: errorData || 'Error al procesar el archivo Excel' },
            { status: 500 }
          ));
          return;
        }

        try {
          const result = JSON.parse(outputData);
          if (result.error) {
            reject(NextResponse.json(
              { error: result.error },
              { status: 400 }
            ));
            return;
          }
          resolve(NextResponse.json(result));
        } catch {
          reject(NextResponse.json(
            { error: 'Error al procesar la respuesta del script' },
            { status: 500 }
          ));
        }
      });
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 