import { Request, Response } from "express";
import { jsonResponse } from "../../shared/utils";
import { isValidObjectId } from "mongoose";
import usersService from "../users/users.service";
import dreamsService from "./dreams.service";

const getDreams = async (req: Request, res: Response) => {
  const dreams = await dreamsService.getDreams();
  return res.json(jsonResponse(true, dreams, "Dreams found"));
};

const addDream = async (req: Request, res: Response) => {
  try {
    const user = await usersService.getUserByUsername(req.body.user.username);
    const dream = await dreamsService.addDream(user?.id, req.body);

    const forReturn = { ...dream, user: user?.toModel };
    return res.send(jsonResponse(true, forReturn, "Dream successfully added."));
  } catch (error: any) {
    if (error && error.error && error.error.length > 0) {
      return res.json(jsonResponse(false, null, error?.errors[0]));
    }
    return res.json(jsonResponse(false, null, "An unexpected error occured, please try again later."));
  }
};

const updateDream = async (req: Request, res: Response) => {
  try {
    const user = await usersService.getUserByUsername(req.body.user.username);
    const dream = await dreamsService.updateDream(req.body);

    const forReturn = { ...dream, user: user?.toModel };
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
  const username = req.body.user.username;
  const controller = new AbortController();
  const { signal } = controller;

  req.on("close", () => {
    controller.abort();
  });

  try {
    if (isValidObjectId(id)) {
      await dreamsService.deleteDream(id, username, signal);
      return res.json(jsonResponse(true, {}, "Dream deleted."));
    } else {
      return res.json(jsonResponse(false, null, "Invalid dream id."));
    }
  } catch (error: any) {
    // Handle abort errors
    if (error.name === "AbortError") {
      return res.json(jsonResponse(false, null, "Delete action aborted."));
    }
  }
};

const getFavoriteDreams = async (req: Request, res: Response) => {
  const favorites = await dreamsService.getRecentlyFavorites();
  res.json(favorites);
};

const getNightmareDreams = async (req: Request, res: Response) => {
  const nightmares = await dreamsService.getRecentlyNightmares();
  res.json(nightmares);
};

const getParalysisDreams = async (req: Request, res: Response) => {
  const paralysis = await dreamsService.getRecentlyParalysis();
  res.json(paralysis);
};

const getRecurrentDreams = async (req: Request, res: Response) => {
  const recurrent = await dreamsService.getRecentlyRecurrent();
  res.json(recurrent);
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
