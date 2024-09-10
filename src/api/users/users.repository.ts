import { User } from "../../shared/models/user";
import { UserSchema } from "../../shared/schema/user";

const addUser = async (user: User) => {
  const addedUser = await new UserSchema({
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
    password: user.password,
  }).save();

  return addedUser;
};

const getUserById = async (id: string) => {
  return UserSchema.findById(id).exec();
};

const getUserByUsername = async (username: string) => {
  return UserSchema.findOne({ username: username }).exec();
};

const getUserByUsernameAndPassword = async (username: string, password: string) => {
  return UserSchema.findOne({ username, password }).exec();
};

const getUsers = async () => {
  return UserSchema.find({});
};

export default {
  addUser,
  getUserById,
  getUsers,
  getUserByUsername,
  getUserByUsernameAndPassword,
};
