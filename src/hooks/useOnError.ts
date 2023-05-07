import { BackendError } from "../types";

export const useOnError = () => {
  const onError = (error: BackendError) => {
    if (error?.response?.data.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return "Ops!";
  };

  return { onError };
};
