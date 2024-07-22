import { Request, Response } from "express";
import userService from "./users.service";

const addUser = (req: Request, res: Response) => {
  console.log("query", req.query);
  console.log("params", req.params);
  const id = req.params.userId;
  const user = userService.addUser(id);
  return res.send(user);
};

const getUser = (req: Request, res: Response) => {
  console.log("query", req.query);
  console.log("params", req.params);
  const id = req.params.userId;
  const user = userService.getUser(id);
  return res.send(user);
};

export default { addUser, getUser };
