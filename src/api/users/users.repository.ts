import { User } from "./../../shared/models/user";

const addUser = (id: string) => {
  // handle database query here
  const user = new User({
    firstname: "Test",
    lastname: "Name",
    username: "testname",
    password: "randompass",
  });
  user.save();
};

const getUser = (id: string) => {
  // handle database query here
  return { id: id };
};

export default { addUser, getUser };
