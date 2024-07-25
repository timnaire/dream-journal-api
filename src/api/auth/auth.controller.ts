import { Request, Response } from "express";
import { generateAccessToken } from "../../shared/middlewares/generate-token";
import { object, string } from "yup";
import { ApiResponse, jsonResponse } from "../../shared/utils";
import { validateAddUser } from "../../shared/validators/user";
import userService from "../users/users.service";
import bcrypt from "bcrypt";
import jwt, { VerifyErrors } from "jsonwebtoken";

const signInUser = async (req: Request, res: Response) => {
  console.log("cookie", req.headers.cookie);
  try {
    let credentials = object({
      username: string().trim().required(),
      password: string().trim().required(),
    });

    const validatedUser = await credentials.validate(req.body);
    const isUserExist = await userService.getUserByUsername(validatedUser.username);

    if (isUserExist) {
      bcrypt.compare(validatedUser.password, isUserExist.password, (err, result) => {
        if (err) {
          return res.json(jsonResponse(false, null, "An unexpected error occured, please try again later."));
        }

        if (result) {
          const token = generateAccessToken(req.body.username, req.body.password);
          res.cookie("token", token, { httpOnly: true });
          return res.json(token);
        } else {
          return res.json(jsonResponse(false, null, "Incorrect password."));
        }
      });
    } else {
      return res.json(jsonResponse(false, null, "User not found."));
    }
  } catch (error: any) {
    if (error && error.error.length > 0 && error.error[0]) {
      return res.json(jsonResponse(false, null, error?.errors[0]));
    }
    return res.json(jsonResponse(false, null, "An unexpected error occured, please try again later."));
  }
};

const signUpUser = async (req: Request, res: Response) => {
  const params = await validateAddUser(req.body);

  let forReturn: ApiResponse;
  if (params.isValid) {
    // Hashing user's password before adding it to the database
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(params.data.password, salt, async (err, hash) => {
        const user = { ...params.data, password: hash };

        const isUserAdded = await userService.addUser(user);
        if (isUserAdded) {
          forReturn = jsonResponse(true, user, "User added");
        } else {
          forReturn = jsonResponse(false, null, "User Exist");
        }
        return res.json(forReturn);
      });
    });
  } else {
    return res.json(jsonResponse(false, null, params.message));
  }
};

const signOutUser = (res: Response, req: Request) => {
  res.cookie("token", "", { expires: new Date() });
  res.json({ redirect: "/sign-in" });
};

const validateToken = (res: Response, req: Request) => {
  const token = req.headers.cookie && req.headers.cookie.split("=")[1];

  if (!token) return res.json({ redirect: "/sign-in" });

  jwt.verify(token, process.env.JWT_SECRET as string, (err: VerifyErrors | null, user: any) => {
    if (err) {
      return res.json({ redirect: "/sign-in" });
    }
    return res.json(token);
  });

  res.json({ redirect: "/sign-in" });
};

export default { signInUser, signUpUser, signOutUser, validateToken };
