import { ObjectId } from "mongoose";
import { Dream } from "../../shared/models/dream";
import { DreamSchema } from "../../shared/schema/dream";

const getDreams = async () => {
  return await DreamSchema.find({});
};

const addDream = async (id: ObjectId, dream: Dream) => {
  return await new DreamSchema({ ...dream, userId: id }).save();
};

const updateDream = async (dream: Dream) => {
  return await DreamSchema.findByIdAndUpdate(dream.id, dream, { returnDocument: "after", timestamps: false });
};

const deleteDream = async (id: string) => {
  return await DreamSchema.findByIdAndDelete(id);
};

export default { getDreams, addDream, updateDream, deleteDream };
