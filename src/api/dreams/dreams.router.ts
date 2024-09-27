import express from "express";
import dreamsController from "./dreams.controller";

const router = express.Router();

router.get("/", dreamsController.getDreams);
router.post("/", dreamsController.addDream);
router.put("/", dreamsController.updateDream);
router.delete("/:id", dreamsController.deleteDream);

router.get("/recent-dreams", dreamsController.getRecentDreams);
router.get("/recent-favorite", dreamsController.getFavoriteDreams);
router.get("/recent-nightmare", dreamsController.getNightmareDreams);
router.get("/recent-paralysis", dreamsController.getParalysisDreams);
router.get("/recent-recurrent", dreamsController.getRecurrentDreams);

export default router;
