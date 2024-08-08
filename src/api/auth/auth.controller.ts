import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../../shared/middlewares/generate-token";
import { ApiResponse, jsonResponse } from "../../shared/utils";
import { validateAddUser } from "../../shared/validators/user";
import { isAuthenticated } from "../../shared/middlewares/is-authenticated";
import { object, string } from "yup";
import userService from "../users/users.service";
import bcrypt from "bcrypt";

const signInUser = async (req: Request, res: Response) => {
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
          return res.json(jsonResponse(true, isUserExist.toModel, "User authenticated."));
        } else {
          return res.json(jsonResponse(false, null, "Incorrect password."));
        }
      });
    } else {
      return res.json(jsonResponse(false, null, "Incorrect username or password."));
    }
  } catch (error: any) {
    if (error && error.error && error.error.length > 0) {
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

const signOutUser = (req: Request, res: Response) => {
  res.cookie("token", "", { expires: new Date() });
  return res.json({ redirect: "/sign-in" });
};

const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
  // Logic for forgot password
  // email the password
  return res.json({});
};

const changePassword = (req: Request, res: Response, next: NextFunction) => {
  // Logic for change password
  // email the password
  return res.json({});
};

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  isAuthenticated(req, res, async (err?: any) => {
    if (err) {
      return res.status(401).json({ redirect: "/sign-in" });
    }

    const user = await userService.getUserByUsername(req.body.user.username);

    return res.json({ isAuthenticated: true, user: user?.toModel });
  });
};

export default {
  signInUser,
  signUpUser,
  signOutUser,
  forgotPassword,
  changePassword,
  validateToken,
};
