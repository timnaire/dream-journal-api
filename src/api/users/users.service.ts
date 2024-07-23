import { User } from "../../shared/models/user";
import userRepository from "./users.repository";

const addUser = async (user: User) => {
  const isUserExist = await userRepository.getUserByUsername(user.username);

  if (isUserExist) {
    return null;
  }
  return userRepository.addUser(user);
};

const getUser = (id: string) => {
  return userRepository.getUserById(id);
};

const getUserByUsername = (username: string) => {
  return userRepository.getUserByUsername(username);
};

const getUserByUsernameAndPassword = (username: string, password: string) => {
  return userRepository.getUserByUsernameAndPassword(username, password);
};

const getUsers = () => {
  return userRepository.getUsers();
};

export default {
  addUser,
  getUser,
  getUsers,
  getUserByUsername,
  getUserByUsernameAndPassword
};
