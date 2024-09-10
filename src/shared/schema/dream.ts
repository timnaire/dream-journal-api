import mongoose from "mongoose";
const Schema = mongoose.Schema;

const dreamSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    dream: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    imageId: mongoose.Schema.Types.ObjectId,
    audioId: mongoose.Schema.Types.ObjectId,
    recurrent: Boolean,
    nightmare: Boolean,
    paralysis: Boolean,
    favorite: Boolean,
    createdAt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

export const DreamSchema = mongoose.model("Dream", dreamSchema);
