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
import { FC, lazy } from "react";
import { useAuth } from "./hooks/useAuth";
import { IonReactRouter } from "@ionic/react-router";
import { Loading } from "./pages/Loading";

setupIonicReact({
  mode: "ios",
});

const Authenticated = lazy(() => import("./pages/Authenticated"));
const Unauthenticated = lazy(() => import("./pages/Unauthenticated"));

const App: FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  return (
    <IonApp>
      <IonReactRouter>
        {isLoading ? (
          <Loading />
        ) : isAuthenticated ? (
          <Authenticated />
        ) : (
          <Unauthenticated />
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
