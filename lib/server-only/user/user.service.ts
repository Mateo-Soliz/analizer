"use server";
import connectMongo from "@/lib/mongo";
import { User } from "@/lib/mongo/models/Users";
import { User as UserType } from "./user.type";

export const createUser = async (user: UserType) => {
  await connectMongo();
  const newUser = await User.findOneAndUpdate({ uid: user.uid }, user, {
    upsert: true,
    new: true,
  });
  return JSON.parse(JSON.stringify(newUser));
};

export const getUser = async (uid: string) => {
  await connectMongo();
  const user = await User.findOne({ uid }).lean();
  return JSON.parse(JSON.stringify(user));
};

export const updateUser = async (uid: string, user: UserType) => {
  await connectMongo();
  const updatedUser = await User.findOneAndUpdate({ uid }, user, {
    new: true,
  });
  return JSON.parse(JSON.stringify(updatedUser));
};
