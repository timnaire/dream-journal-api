import express from "express";
import usersRoute from "./users/users.router";
import dreamsRoute from "./dreams/dreams.router";
import authorizationRoute from "./authorization/authorization.router";
import { isAuthenticated } from "../shared/middlewares/is-authenticated";

const router = express.Router();

router.use("/", authorizationRoute);
router.use("/users/", isAuthenticated, usersRoute);
router.use("/dreams/", isAuthenticated, dreamsRoute);

export default router;
