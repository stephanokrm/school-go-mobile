import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";

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
import { IonReactRouter } from "@ionic/react-router";
import { Loading } from "./pages/Loading";
import { useJsApiLoader } from "@react-google-maps/api";
import Authenticated from "./pages/Authenticated";
import Unauthenticated from "./pages/Unauthenticated";
import { Route } from "react-router-dom";

setupIonicReact({
  mode: "ios",
});

const App: FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  return (
    <IonApp>
      <IonReactRouter>
        {isLoading || !isLoaded ? (
          <Loading />
        ) : (
          <IonRouterOutlet id="main">
            <Route
              component={isAuthenticated ? Authenticated : Unauthenticated}
            />
          </IonRouterOutlet>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
