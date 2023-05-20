import { FC, PropsWithChildren } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <>{children}</>;

  return <Redirect to="/login" />;
};
