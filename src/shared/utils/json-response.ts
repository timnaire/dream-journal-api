export interface ApiResponse {
  success: boolean;
  data: any;
  message: string;
}

export const jsonResponse = (success: boolean, data: any, message: string): ApiResponse => {
  return {
    success,
    data,
    message,
  };
};
