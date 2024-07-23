import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { ApiResponse, jsonResponse } from "../../shared/utils";
import { validateUser } from "../../shared/validators/user";
import userService from "./users.service";

const addUser = async (req: Request, res: Response) => {
  const params = await validateUser(req.body);

  let forReturn: ApiResponse;
  if (params.isValid) {
    const user = await userService.addUser(params.data);
    console.log("user", user);
    if (user) {
      forReturn = jsonResponse(true, user, "User added");
    } else {
      forReturn = jsonResponse(false, null, "User Exist");
    }
  } else {
    forReturn = jsonResponse(false, null, params.message);
  }
  res.send(forReturn);
};

const getUser = async (req: Request, res: Response) => {
  const id = req.params.userId;
  let user = null;
  if (isValidObjectId(id)) {
    user = await userService.getUser(id);
  }

  let forReturn: ApiResponse;
  if (user) {
    forReturn = jsonResponse(true, user, "User found");
  } else {
    forReturn = jsonResponse(false, null, "User not found");
  }

  return res.send(forReturn);
};

const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  return res.send(users);
};

export default { addUser, getUser, getUsers };
