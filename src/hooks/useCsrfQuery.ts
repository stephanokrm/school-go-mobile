import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";

export const useCsrfQuery = () => {
  return useQuery(
    ["csrf"],
    () => {
      return axios.get("/sanctum/csrf-cookie");
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );
};
