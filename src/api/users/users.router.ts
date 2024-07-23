import express from "express";
import userController from "./users.controller";

const router = express.Router();

router.get("/", userController.getUsers);

router.get("/:userId", userController.getUser);

router.post("/:userId", userController.addUser);

// router.put("/:userId", userController.updateUser);

// router.delete("/:userId", userController.deleteUser);

export default router;
