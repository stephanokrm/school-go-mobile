import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";
import { useHistory } from "react-router";
import { useCsrfQuery } from "./useCsrfQuery";
import { BackendError } from "../types";
import { LoginForm } from "../pages/Login";

interface Response {}

export const useLoginMutation = () => {
  const history = useHistory();
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation<Response, BackendError, LoginForm>(
    ["login"],
    async (login) => {
      const { data } = await axios.post<Response>("/login", login);

      await queryClient.invalidateQueries(["getUserByMe"]);
      await history.push("/pagina-inicial");

      return data;
    }
  );
};
