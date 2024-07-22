import mongoose from "mongoose";

const dbConnect = () => {
  const connectionString = process.env.ATLAS_URI || "";
  const conn = mongoose.connect(connectionString);
  return conn;
};
export default dbConnect;
