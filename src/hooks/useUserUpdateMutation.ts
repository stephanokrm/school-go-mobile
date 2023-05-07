import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCsrfQuery } from "./useCsrfQuery";
import { BackendError, RawUser, Resource, User } from "../types";
import axios from "../lib/axios";
import { userToRawUser } from "../adapters/userToRawUser";

type Response = Resource<RawUser>;

export const useUserUpdateMutation = () => {
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation<Response, BackendError, User>(
    ["userUpdate"],
    async (user) => {
      const { data } = await axios.post<Response>(`/api/user/${user.id}`, {
        ...(await userToRawUser(user as User)),
        _method: "PUT",
      });

      await queryClient.invalidateQueries(["getUserByMe"]);

      return data;
    }
  );
};
