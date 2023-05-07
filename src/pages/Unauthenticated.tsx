import { FC } from "react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { Login } from "./Login";

export const Unauthenticated: FC = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};
