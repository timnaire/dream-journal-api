import express from "express";
import userController from "./users.controller";

const router = express.Router();

// Get all users
router.get("/", userController.getUsers);

// Add new user
router.post("/", userController.addUser);

// Get a user
router.get("/:userId", userController.getUser);

// Update a user
// router.put("/:userId", userController.updateUser);

// Delete a user
// router.delete("/:userId", userController.deleteUser);

export default router;
