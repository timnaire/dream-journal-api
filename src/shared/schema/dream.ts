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
    recurrent: Boolean,
    nightmare: Boolean,
    paralysis: Boolean,
    favorite: Boolean,
  },
  {
    timestamps: true,
    virtuals: {
      toModel: {
        get() {
          return {
            id: this.id,
            title: this.title,
            dream: this.dream,
            recurrent: this.recurrent,
            nightmare: this.nightmare,
            paralysis: this.paralysis,
            favorite: this.favorite,
            userId: this.userId,
          };
        },
      },
    },
  }
);

dreamSchema.virtual("toModel").get(function () {
  return {
    id: this.id,
    title: this.title,
    dream: this.dream,
    recurrent: this.recurrent,
    nightmare: this.nightmare,
    paralysis: this.paralysis,
    favorite: this.favorite,
    userId: this.userId,
  };
});

export const DreamSchema = mongoose.model("Dream", dreamSchema);
