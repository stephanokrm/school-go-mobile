import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";
import { useHistory } from "react-router";
import { useCsrfQuery } from "./useCsrfQuery";

export const useLogoutMutation = () => {
  const history = useHistory();
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation(["logout"], async () => {
    await axios.post("/logout");
    await queryClient.clear();
    await history.push("/login");
  });
};
