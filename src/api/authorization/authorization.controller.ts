import { Request, Response } from "express";
import { generateAccessToken } from "../../shared/middlewares/generate-token";
import { object, string } from "yup";
import { ApiResponse, jsonResponse } from "../../shared/utils";
import { validateAddUser } from "../../shared/validators/user";
import userService from "../users/users.service";
import bcrypt from "bcrypt";


const signInUser = async (req: Request, res: Response) => {
    console.log('cookie', req.headers.cookie);
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
                    return res.json(jsonResponse(false, null, "An error occured, please try again later."));
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
        return res.json(jsonResponse(false, null, error?.errors[0]));
    }
}

const signUpUser = async (req: Request, res: Response) => {
    const params = await validateAddUser(req.body);

    let forReturn: ApiResponse;
    if (params.isValid) {

        // Hashing user's password before adding it to the database
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(params.data.password, salt, async (err, hash) => {
                const user = { ...params.data, password: hash }

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
}

export default { signInUser, signUpUser } 