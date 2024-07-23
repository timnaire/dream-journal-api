import express from "express";
import usersRoute from "./users/users.router";

const router = express.Router();

router.use("/users/", usersRoute);
// router.use("/dreams/", usersRoute);

export default router;
