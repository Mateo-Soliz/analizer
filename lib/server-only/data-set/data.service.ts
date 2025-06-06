"use server";

import connectMongo from "@/lib/mongo";
import ChartGallery from "@/lib/mongo/models/ChartGallery";
import DataSet from "@/lib/mongo/models/DataSet";
import * as XLSX from "xlsx";
import { ChartGalleryType, DataSetType } from "./data.type";

export const createDataSet = async (dataSet: DataSetType) => {
  await connectMongo();
  const newDataSet = await DataSet.create(dataSet);
  return newDataSet;
};

export async function processExcelFile(file: File) {
  // Validar que sea un archivo Excel
  if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
    throw new Error("El archivo debe ser un Excel (.xlsx o .xls)");
  }

  // Leer el archivo en memoria
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Parsear el archivo Excel
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: null,
  });

  if (!json.length) {
    throw new Error("El archivo Excel está vacío o no se pudo leer");
  }

  // Validar columnas
  const columns = Object.keys(json[0]);
  if (!columns.includes("Time point")) {
    throw new Error('El archivo debe contener una columna "Time point"');
  }
  if (columns.length < 2) {
    throw new Error(
      'El archivo debe contener al menos una columna de datos además de "Time point"'
    );
  }

  // Validar datos nulos en Time point
  for (const row of json) {
    if (row["Time point"] === null || row["Time point"] === undefined) {
      throw new Error(
        'La columna "Time point" no puede contener valores nulos'
      );
    }
  }

  // Extraer datos en el formato esperado
  const timePoints = json.map((row) => row["Time point"]);
  const groups = columns.filter((col) => col !== "Time point");
  const values = groups.map((group) => json.map((row) => row[group]));

  return {
    timePoints,
    groups,
    values,
  };
}

export const saveDataSet = async (dataSet: DataSetType) => {
  try {
    await connectMongo();
    console.log(dataSet);
    const newDataSet = await DataSet.create({
      owner: dataSet.owner,
      name: dataSet.name,
      data: dataSet.data,
    });
    return JSON.parse(JSON.stringify(newDataSet));
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const createGallery = async (dataSet: ChartGalleryType) => {
  try {
    await connectMongo();
    const newGallery = await ChartGallery.create({
      title: dataSet.title,
      description: dataSet.description,
      type: dataSet.type,
      xAxis: dataSet.xAxis,
      yAxis: dataSet.yAxis,
      data: dataSet.data,
      isPublic: dataSet.isPublic ?? true,
      date: dataSet.date,
      category: dataSet.category,
      tags: dataSet.tags,
      views: dataSet.views ?? 0,
      likes: dataSet.likes ?? 0,
      owner: dataSet.owner,
    });
    return JSON.parse(JSON.stringify(newGallery));
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getGallery = async (id: string) => {
  try {
    await connectMongo();
    const gallery = await ChartGallery.find({
      owner: id,
    }).populate("data");
    return JSON.parse(JSON.stringify(gallery));
  } catch (error) {
    console.error(error);
    return false;
  }
};
