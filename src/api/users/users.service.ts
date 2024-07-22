import userRepository from "./users.repository";

const addUser = (id: string) => {
  // handle application services here
  return userRepository.addUser(id);
};

const getUser = (id: string) => {
  // handle application services here
  return userRepository.getUser(id);
};

export default { addUser, getUser };
