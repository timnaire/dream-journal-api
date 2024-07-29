import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    virtuals: {
      toModel: {
        get() {
          return {
            firstname: this.firstname,
            lastname: this.lastname,
            fullname: this.firstname + " " + this.lastname,
            username: this.username,
            email: this.email,
          };
        },
      },
      fullname: {
        get() {
          return this.firstname + " " + this.lastname;
        },
      },
    },
  }
);

userSchema.virtual("toModel").get(function () {
  return {
    firstname: this.firstname,
    lastname: this.lastname,
    fullname: this.fullname,
    username: this.username,
    email: this.email,
  };
});

userSchema.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});

export const UserSchema = mongoose.model("User", userSchema);
