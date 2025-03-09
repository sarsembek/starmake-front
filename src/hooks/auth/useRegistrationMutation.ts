import { registerUser } from "@/api/auth/registerUser";
import { RegisterResponse, EmailExistsError, RegisterRequest, ValidationError } from "@/types/auth/auth.type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useRegisterMutation() {
  return useMutation<
    RegisterResponse,
    AxiosError<ValidationError | EmailExistsError>,
    RegisterRequest
  >({
    mutationFn: registerUser,
    onError: (error) => {
      // You can add global error handling here
      console.error("Registration failed:", error);
    },
  });
}