import { FC } from "react";
import { IonRouterOutlet, IonSpinner } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { Login } from "./Login";
import { useAuth } from "../hooks/useAuth";

const Unauthenticated: FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <IonSpinner color="primary" />;

  if (isAuthenticated) return <Redirect to="/pagina-inicial" />;

  return (
    <IonRouterOutlet>
      <Route exact path="/login" component={Login} />
      <Route render={() => <Redirect to="/login" />} />
    </IonRouterOutlet>
  );
};

export default Unauthenticated;
