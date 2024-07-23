import { User } from "./../../shared/models/user";

const addUser = (user: any) => {
  new User({
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    password: user.password,
  }).save();
};

const getUser = async (id: string) => {
  const user = await User.findById(id).exec();
  return user;
};

const getUsers = async () => {
  const users = await User.find({}).exec();
  return users;
};

export default { addUser, getUser, getUsers };
