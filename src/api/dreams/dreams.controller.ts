import { Request, Response } from "express";

const getDreams = (req: Request, res: Response) => {
  return res.send({ dreams: [] });
};

const addDream = (req: Request, res: Response) => {
  return res.send({ dreams: [] });
};

export default {
  getDreams,
  addDream,
};
