import express from "express";
import usersController from "./users.controller";

const router = express.Router();

router.get("/", usersController.getUsers);
// router.post("/", usersController.addUser);
router.get("/:userId", usersController.getUser);
// router.put("/:userId", usersController.updateUser);
// router.delete("/:userId", usersController.deleteUser);

export default router;
