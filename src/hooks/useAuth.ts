import { useGetUserByMeQuery } from "./useGetUserByMeQuery";

export const useAuth = () => {
  const { data: user, isLoading, error } = useGetUserByMeQuery();

  return {
    user,
    isLoading: isLoading && !error,
    isAuthenticated: !!user && !error,
  };
};
