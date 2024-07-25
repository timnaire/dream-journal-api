import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.cookie && req.headers.cookie.split("=")[1];

    console.log("token", token);

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, user: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.redirect(307, "/api/auth/sign-out");
        }

        return res.sendStatus(403);
      }
      req.body.user = user;
      console.log("req.body.user", req.body.user);
      next();
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};
