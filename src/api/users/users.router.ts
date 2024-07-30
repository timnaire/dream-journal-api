import express from "express";
import usersController from "./users.controller";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);

export default router;
