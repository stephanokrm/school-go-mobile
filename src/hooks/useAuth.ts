import { useEffect } from "react";
import { useGetUserByMeQuery } from "./useGetUserByMeQuery";
import { useLogoutMutation } from "./useLogoutMutation";
import { useIonRouter } from "@ionic/react";

interface UseAuth {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?: string;
}
export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: UseAuth = {}) => {
  const router = useIonRouter();
  const { data: user, isLoading, isFetching } = useGetUserByMeQuery();
  const { mutate: logout } = useLogoutMutation();

  const isSyncing = isLoading || isFetching;

  useEffect(() => {
    if (isSyncing) return;

    if (middleware === "guest" && user) {
      return router.push("/pagina-inicial");
    }

    if (middleware === "auth" && !user) {
      return logout();
    }
  }, [user, logout, middleware, redirectIfAuthenticated, history, isSyncing]);

  return {
    user,
  };
};