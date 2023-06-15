import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";
import { useCsrfQuery } from "./useCsrfQuery";
import { BackendError } from "../types";
import { LoginForm } from "../pages/Login";
import { useHistory } from "react-router";

interface Response {}

export const useLoginMutation = () => {
  const history = useHistory();
  const queryClient = useQueryClient();

  const { refetch } = useCsrfQuery();

  return useMutation<Response, BackendError, LoginForm>(
    ["login"],
    async (login) => {
      const { data } = await axios.post<Response>("/login", login);

      await queryClient.invalidateQueries(["getUserByMe"]);
      await history.push("/home");

      return data;
    },
    {
      onError: async (error) => {
        if (error.status === 419) {
          await refetch();
        }
      },
    }
  );
};
