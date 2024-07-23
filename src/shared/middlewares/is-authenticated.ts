import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log(authHeader);
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
            if (err) {
                console.log(err)
                return res.sendStatus(403);
            }
            req.body.user = user;
            console.log('req.body.user', req.body.user);
            next();
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
}