import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { ApiResponse, jsonResponse } from "../../shared/utils";
import userService from "./users.service";

const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;
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

  return res.json(forReturn);
};

const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  return res.json(jsonResponse(true, users, "Users found"));
};

export default { getUser, getUsers };
