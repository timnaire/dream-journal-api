import mongoose from "mongoose";
const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  {
    fileType: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    virtuals: {
      toDreamModel: {
        get() {
          return {
            fileUrl: this.fileUrl,
            filename: this.filename,
          };
        },
      },
    },
  }
);

mediaSchema.virtual("toDreamModel").get(function () {
  return {
    fileUrl: this.fileUrl,
    filename: this.filename,
  };
});

export const MediaSchema = mongoose.model("Media", mediaSchema);
