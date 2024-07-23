import userRepository from "./users.repository";

const addUser = (user: any) => {
  return userRepository.addUser(user);
};

const getUser = (id: string) => {
  return userRepository.getUser(id);
};

const getUsers = () => {
  return userRepository.getUsers();
};


export default { addUser, getUser, getUsers };
