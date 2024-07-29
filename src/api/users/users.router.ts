import express from "express";
import usersController from "./users.controller";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:userId", usersController.getUser);

export default router;
