import express from "express";
import authorization from "./authorization.controller";

const router = express.Router();

router.post('/sign-in', authorization.signInUser);
router.post('/sign-up', authorization.signUpUser);

export default router;