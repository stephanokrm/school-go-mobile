import { IonApp, setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { FC } from "react";
import { useAuth } from "./hooks/useAuth";
import { Authenticated } from "./pages/Authenticated";
import { Unauthenticated } from "./pages/Unauthenticated";
import { IonReactRouter } from "@ionic/react-router";

setupIonicReact({
  mode: "ios",
});

const App: FC = () => {
  const { user } = useAuth();

  const isAuthenticated = !!user;

  return (
    <IonApp>
      <IonReactRouter>
        {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
