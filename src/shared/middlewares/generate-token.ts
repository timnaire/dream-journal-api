import jwt from "jsonwebtoken";

export const generateAccessToken = (username: string, password: string) => {
    return jwt.sign({ username, password }, process.env.JWT_SECRET as string, { expiresIn: '1800s' });
}
