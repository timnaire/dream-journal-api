import express from "express";
import userController from "./users.controller";

const router = express.Router();

router.get("/:userId", userController.getUser);

router.post("/:userId", userController.addUser);

// router.put("/:userId", (req: Request, res: Response) => {
//   res.send("update user");
// });

// router.delete("/:userId", (req: Request, res: Response) => {
//   res.send("delete user");
// });

export default router;
