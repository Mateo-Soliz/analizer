"use server";

import connectMongo from "@/lib/mongo";
import DataSet from "@/lib/mongo/models/DataSet";
import { DataSetType } from "./data.type";

export const createDataSet = async (dataSet: DataSetType) => {
  await connectMongo();
  const newDataSet = await DataSet.create(dataSet);
  return newDataSet;
};
