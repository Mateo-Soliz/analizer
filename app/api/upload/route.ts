import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

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

    // Leer el archivo en memoria
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parsear el archivo Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null });

    if (!json.length) {
      return NextResponse.json(
        { error: 'El archivo Excel está vacío o no se pudo leer' },
        { status: 400 }
      );
    }

    // Validar columnas
    const columns = Object.keys(json[0]);
    if (!columns.includes('Time point')) {
      return NextResponse.json(
        { error: 'El archivo debe contener una columna \"Time point\"' },
        { status: 400 }
      );
    }
    if (columns.length < 2) {
      return NextResponse.json(
        { error: 'El archivo debe contener al menos una columna de datos además de \"Time point\"' },
        { status: 400 }
      );
    }

    // Validar datos nulos en Time point
    for (const row of json) {
      if (row['Time point'] === null || row['Time point'] === undefined) {
        return NextResponse.json(
          { error: 'La columna \"Time point\" no puede contener valores nulos' },
          { status: 400 }
        );
      }
    }

    // Extraer datos en el formato esperado
    const timePoints = json.map((row) => row['Time point']);
    const groups = columns.filter(col => col !== 'Time point');
    const values = groups.map(group => json.map((row) => row[group]));

    return NextResponse.json({
      data: {
        timePoints,
        groups,
        values
      }
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Error interno del servidor', details: (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 