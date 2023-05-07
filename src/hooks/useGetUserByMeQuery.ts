import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import { rawUserToUser } from "../adapters/rawUserToUser";
import { RawUser, Resource } from "../types";

export const useGetUserByMeQuery = () => {
  return useQuery(["getUserByMe"], async ({ signal }) => {
    const {
      data: { data: rawUser },
    } = await axios.get<Resource<RawUser>>("/api/user/me", {
      signal,
    });

    return rawUserToUser(rawUser);
  });
};
