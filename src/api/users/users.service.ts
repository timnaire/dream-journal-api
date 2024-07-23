import { User } from "../../shared/models/user";
import userRepository from "./users.repository";

const addUser = async (user: User) => {
  const isUserExist = await userRepository.getUserByUsername(user.username);

  console.log("isUserExist", isUserExist);
  if (isUserExist) {
    return null;
  }
  return userRepository.addUser(user);
};

const getUser = (id: string) => {
  return userRepository.getUserById(id);
};

const getUsers = () => {
  return userRepository.getUsers();
};

export default { addUser, getUser, getUsers };
