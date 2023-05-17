import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";
import { useCsrfQuery } from "./useCsrfQuery";
import { BackendError } from "../types";
import { LoginForm } from "../pages/Login";
import { useIonRouter } from "@ionic/react";

interface Response {}

export const useLoginMutation = () => {
  const router = useIonRouter();
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation<Response, BackendError, LoginForm>(
    ["login"],
    async (login) => {
      const { data } = await axios.post<Response>("/login", login);

      await queryClient.invalidateQueries(["getUserByMe"]);
      await router.push("/pagina-inicial", "root", "replace");

      return data;
    }
  );
};
