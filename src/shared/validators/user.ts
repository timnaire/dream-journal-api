import { mixed, object, string } from "yup";

interface ValidatorResponse {
  isValid: boolean;
  message: string;
  data: any;
}

export const validateAddUser = async (data: any): Promise<ValidatorResponse> => {
  let forReturn: ValidatorResponse;
  try {
    let userSchema = object({
      firstname: string().min(2, "${path} must be at least 2 characters long").required(),
      lastname: string().min(2, "${path} must be at least 2 characters long").required(),
      username: string().min(3, "${path} must be at least 3 characters long").required(),
      password: string().min(8, "${path} must be at least 8 characters long").required(),
    });

    forReturn = {
      isValid: true,
      data: await userSchema.validate(data),
      message: "All fields are valid",
    };
    return forReturn;
  } catch (error: any) {
    forReturn = { isValid: false, data: null, message: error?.errors[0] };
    console.log(error);
    return forReturn;
  }
};

// export const validateUpdateUser = async (data: any): Promise<ValidatorResponse> => {
//   let forReturn: ValidatorResponse;
//   try {
//     let userSchema = object({
//       firstname: string()
//         .min(2, "${path} must be at least 2 characters long"),
//       lastname: string()
//         .min(2, "${path} must be at least 2 characters long"),
//       username: string()
//         .min(3, "${path} must be at least 3 characters long"),
//     }).shape({
//       profilePicture: mixed().required('File is required'),
//     })

//     forReturn = {
//       isValid: true,
//       data: await userSchema.validate(data),
//       message: "All fields are valid",
//     };
//     return forReturn;
//   } catch (error: any) {
//     forReturn = { isValid: false, data: null, message: error?.errors[0] };
//     console.log(error);
//     return forReturn;
//   }
// };
