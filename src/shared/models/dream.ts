import { ObjectId } from "mongoose";

export interface Dream {
  id?: string;
  title: string;
  dream: string;
  recurrent: boolean;
  nightmare: boolean;
  paralysis: boolean;
  favorite: boolean;
  userId?: ObjectId;
}
