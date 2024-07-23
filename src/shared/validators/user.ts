import { object, string } from "yup";

interface ValidatorResponse {
  isValid: boolean;
  message: string;
  data: any;
}

export const validateUser = async (data: any): Promise<ValidatorResponse> => {
  let forReturn: ValidatorResponse;
  try {
    let userSchema = object({
      firstname: string()
        .min(2, "must be at least 2 characters long")
        .required(),
      lastname: string()
        .min(2, "must be at least 2 characters long")
        .required(),
      username: string()
        .min(3, "must be at least 3 characters long")
        .required(),
      password: string()
        .min(8, "must be at least 8 characters long")
        .required(),
    });

    forReturn = {
      isValid: true,
      data: await userSchema.validate(data),
      message: "All fields are valid",
    };
    return forReturn;
  } catch (error: any) {
    forReturn = { isValid: false, data: null, message: error?.errors[0] };
    return forReturn;
  }
};
