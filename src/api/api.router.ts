import express from "express";
import usersRoute from "./users/users.router";

const router = express.Router();

router.use("/users/", usersRoute);

export default router;
