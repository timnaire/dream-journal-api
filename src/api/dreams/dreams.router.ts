import express from "express";
import dreamsController from "./dreams.controller";

const router = express.Router();

router.get("/", dreamsController.getDreams);
router.post("/", dreamsController.addDream);

export default router;
