import express from "express";
import auth from "./auth.controller";

const router = express.Router();

router.post("/sign-in", auth.signInUser);
router.post("/sign-up", auth.signUpUser);
router.post("/sign-out", auth.signOutUser);
router.post("/forgot-password", auth.forgotPassword);
router.post("/change-password", auth.forgotPassword);
router.post("/validate-token", auth.validateToken);

export default router;
