import { FC } from "react";
import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { Login } from "./Login";
import { useAuth } from "../hooks/useAuth";

export const Unauthenticated: FC = () => {
  useAuth({ middleware: "guest", redirectIfAuthenticated: "/pagina-inicial" });

  return (
    <IonRouterOutlet>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
    </IonRouterOutlet>
  );
};
