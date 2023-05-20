import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";
import { useCsrfQuery } from "./useCsrfQuery";
import { useHistory } from "react-router";

export const useLogoutMutation = () => {
  const history = useHistory();
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation(["logout"], async () => {
    await axios.post("/logout");
    await queryClient.invalidateQueries(["getUserByMe"]);
    await history.push("/login");
  });
};
