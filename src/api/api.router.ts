import express from "express";
import usersRoute from "./users/users.router";
import dreamsRoute from "./dreams/dreams.router";
import authorizationRoute from "./auth/auth.router";
import { isAuthenticated } from "../shared/middlewares/is-authenticated";

const router = express.Router();

router.use("/auth/", authorizationRoute);
router.use("/users/", isAuthenticated, usersRoute);
router.use("/dreams/", isAuthenticated, dreamsRoute);

export default router;
