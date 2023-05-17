import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";
import { useCsrfQuery } from "./useCsrfQuery";
import { useIonRouter } from "@ionic/react";

export const useLogoutMutation = () => {
  const router = useIonRouter();
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation(["logout"], async () => {
    await axios.post("/logout");
    await queryClient.invalidateQueries(["getUserByMe"]);
    await router.push("/login", "root", "replace");
  });
};
