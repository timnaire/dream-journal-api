import { ObjectId } from "mongoose";
import { Dream } from "../../shared/models/dream";
import { DreamSchema } from "../../shared/schema/dream";
import { MediaSchema } from "../../shared/schema/media";

const getDreams = async () => {
  return DreamSchema.find({}).sort({ createdAt: "desc" });
};

const addDream = async (id: ObjectId, dream: Dream) => {
  return new DreamSchema({ ...dream, userId: id }).save();
};

const updateDream = async (dream: Dream) => {
  return DreamSchema.findByIdAndUpdate(dream.id, dream, { returnDocument: "after", timestamps: false });
};

const deleteDream = async (id: string) => {
  return DreamSchema.findByIdAndDelete(id);
};

const getDreamById = async (id: string) => {
  return DreamSchema.findById(id).exec();
};

const getDreamMediaById = async (id: string) => {
  return MediaSchema.findById(id).exec();
};

const deleteMedia = async (id: string) => {
  return MediaSchema.findByIdAndDelete(id);
};

export default {
  getDreams,
  addDream,
  updateDream,
  deleteDream,
  getDreamById,
  getDreamMediaById,
  deleteMedia,
};
