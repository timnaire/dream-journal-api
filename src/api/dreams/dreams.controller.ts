import { Request, Response } from "express";
import { boolean, object, string } from "yup";
import { jsonResponse } from "../../shared/utils";
import { isValidObjectId } from "mongoose";
import usersService from "../users/users.service";
import dreamsService from "./dreams.service";

const getDreams = async (req: Request, res: Response) => {
  const dreams = await dreamsService.getDreams();
  return res.json(jsonResponse(true, dreams, "Dreams found"));
};

const addDream = async (req: Request, res: Response) => {
  const { title, dream, recurrent, nightmare, paralysis, favorite } = req.body;
  try {
    let dreamSchema = object({
      title: string().trim().required(),
      dream: string().trim().required(),
      recurrent: boolean().required(),
      nightmare: boolean().required(),
      paralysis: boolean().required(),
      favorite: boolean().required(),
    });

    const validateDream = await dreamSchema.validate({ title, dream, recurrent, nightmare, paralysis, favorite });
    const user = await usersService.getUserByUsername(req.body.user.username);
    const addedDream = await dreamsService.addDream(user?.id, validateDream);

    const forReturn = { ...addedDream.toJSON(), user: user?.toModel };
    return res.send(jsonResponse(true, forReturn, "Dream successfully added."));
  } catch (error: any) {
    if (error && error.error && error.error.length > 0) {
      return res.json(jsonResponse(false, null, error?.errors[0]));
    }
    return res.json(jsonResponse(false, null, "An unexpected error occured, please try again later."));
  }
};

const updateDream = async (req: Request, res: Response) => {
  const { id, title, dream, recurrent, nightmare, paralysis, favorite } = req.body;
  try {
    let dreamSchema = object({
      id: string().trim().required(),
      title: string().trim().required(),
      dream: string().trim().required(),
      recurrent: boolean().required(),
      nightmare: boolean().required(),
      paralysis: boolean().required(),
      favorite: boolean().required(),
    });

    const validateDream = await dreamSchema.validate({ id, title, dream, recurrent, nightmare, paralysis, favorite });
    const user = await usersService.getUserByUsername(req.body.user.username);
    const updatedDream = await dreamsService.updateDream(validateDream);

    const forReturn = { ...updatedDream?.toJSON(), user: user?.toModel };
    return res.send(jsonResponse(true, forReturn, "Dream successfully updated."));
  } catch (error: any) {
    if (error && error.error && error.error.length > 0) {
      return res.json(jsonResponse(false, null, error?.errors[0]));
    }
    return res.json(jsonResponse(false, null, "An unexpected error occured, please try again later."));
  }
};

const deleteDream = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (isValidObjectId(id)) {
    await dreamsService.deleteDream(id);
    return res.json(jsonResponse(true, {}, "Dream deleted."));
  } else {
    return res.json(jsonResponse(false, null, "Invalid dream id."));
  }
};

const getFavoriteDreams = async (req: Request, res: Response) => {
  res.json([]);
};
const getNightmareDreams = async (req: Request, res: Response) => {
  res.json([]);
};
const getParalysisDreams = async (req: Request, res: Response) => {
  res.json([]);
};
const getRecurrentDreams = async (req: Request, res: Response) => {
  res.json([]);
};

export default {
  getDreams,
  addDream,
  updateDream,
  deleteDream,
  getFavoriteDreams,
  getNightmareDreams,
  getParalysisDreams,
  getRecurrentDreams,
};
