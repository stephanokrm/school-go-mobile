import { useEffect } from "react";
import { useGetUserByMeQuery } from "./useGetUserByMeQuery";
import { useLogoutMutation } from "./useLogoutMutation";
import { useHistory } from "react-router";

interface UseAuth {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?: string;
}
export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: UseAuth = {}) => {
  const history = useHistory();
  const { data: user, isLoading, isFetching } = useGetUserByMeQuery();
  const { mutate: logout } = useLogoutMutation();

  const isSyncing = isLoading || isFetching;

  useEffect(() => {
    if (
      middleware === "guest" &&
      redirectIfAuthenticated &&
      user &&
      !isSyncing
    ) {
      history.push(redirectIfAuthenticated);
    }

    if (middleware === "auth" && !user && !isSyncing) {
      logout();
    }
  }, [user, logout, middleware, redirectIfAuthenticated, history, isSyncing]);

  return {
    user,
  };
};
