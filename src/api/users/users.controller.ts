import { Request, Response } from "express";
import userService from "./users.service";

const addUser = (req: Request, res: Response) => {
  const { firstname, lastname, username, password } = req.params;
  const user = userService.addUser({ firstname, lastname, username, password });
  return res.send(user);
};

const getUser = async (req: Request, res: Response) => {
  const id = req.params.userId;
  const user = await userService.getUser(id);
  console.log('id', id);
  console.log('user', user);
  return res.send(user);
};

const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  console.log('userController', users);
  return res.send(users);
};

export default { addUser, getUser, getUsers };
