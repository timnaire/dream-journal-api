import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import cookie from "cookie";

// Parse cookie token
const parseTokenFromCookies = (req: Request): string | null => {
  if (!req.headers || !req.headers.cookie) return null;

  const cookies = cookie.parse(req.headers.cookie);
  return cookies.token || null;
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = parseTokenFromCookies(req);

    if (!token) {
      return res.status(401).json({ redirect: "/sign-in" });
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, user: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.cookie("token", "", { expires: new Date() });
          return res.status(401).json({ redirect: "/sign-in" });
        }

        return res.sendStatus(403);
      }
      req.body.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};
