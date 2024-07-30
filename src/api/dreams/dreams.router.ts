import express from "express";
import dreamsController from "./dreams.controller";

const router = express.Router();

router.get("/", dreamsController.getDreams);
router.post("/", dreamsController.addDream);
router.put("/", dreamsController.updateDream);
router.delete("/:id", dreamsController.deleteDream);

export default router;
