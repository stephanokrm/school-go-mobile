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
import { Redirect, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Tabs } from "./pages/Tabs";
import Trip from "./pages/Trip";
import StudentTrip from "./pages/StudentTrip";
import { AuthGuard } from "./components/AuthGuard";
import { Switch } from "react-router";

setupIonicReact({
  mode: "ios",
});

const App: FC = () => {
  const { isLoading } = useAuth();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  return (
    <IonApp>
      {isLoading || !isLoaded ? (
        <Loading />
      ) : (
        <IonReactRouter>
          <IonRouterOutlet id="main">
            <Switch>
              <Route
                path="/tabs"
                render={() => (
                  <AuthGuard>
                    <Tabs />
                  </AuthGuard>
                )}
              />
              <Route
                path="/trip/:trip"
                render={(props) => (
                  <AuthGuard>
                    <Trip {...props} />
                  </AuthGuard>
                )}
              />
              <Route
                path="/student/:student/trip/:trip"
                render={(props) => (
                  <AuthGuard>
                    <StudentTrip {...props} />
                  </AuthGuard>
                )}
              />
              <Route exact path="/login" component={Login} />
              <Route render={() => <Redirect to="/tabs" />} />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      )}
    </IonApp>
  );
};

export default App;
