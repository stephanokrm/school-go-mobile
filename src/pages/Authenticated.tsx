import { FC, lazy, useEffect } from "react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSpinner,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import Home from "./Home";
import Account from "./Account";
import { home, person } from "ionicons/icons";
import { PushNotifications, Token } from "@capacitor/push-notifications";
import { useUserUpdateMutation } from "../hooks/useUserUpdateMutation";
import { useAuth } from "../hooks/useAuth";
import { Toast } from "@capacitor/toast";
import { useJsApiLoader } from "@react-google-maps/api";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

interface SetUpPushNotifications {
  onRegistration: (token: Token) => unknown;
}

const Trip = lazy(() => import("./Trip"));
const StudentTrip = lazy(() => import("./StudentTrip"));

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

const cleanUpPushNotifications = async () => {
  await PushNotifications.removeAllListeners();
};

const registerPushNotifications = async () => {
  const permissionStatus = await PushNotifications.checkPermissions();

  if (
    permissionStatus.receive === "prompt" &&
    (await PushNotifications.requestPermissions()).receive !== "granted"
  ) {
    throw new Error("User denied permissions!");
  }

  await PushNotifications.register();
};

const setUpPushNotifications = async ({
  onRegistration,
}: SetUpPushNotifications) => {
  await cleanUpPushNotifications();

  await PushNotifications.addListener("registration", onRegistration);

  await PushNotifications.addListener("registrationError", (err) => {
    console.error("Registration error: ", err.error);
  });

  await PushNotifications.addListener(
    "pushNotificationReceived",
    async (notification) => {
      await Toast.show({
        text: notification.title ?? "Notificação",
        duration: "long",
        position: "top",
      });
    }
  );

  await PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification) => {
      console.log(
        "Push notification action performed",
        notification.actionId,
        notification.inputValue
      );
    }
  );

  await registerPushNotifications();
};

const Authenticated: FC = () => {
  const { isAuthenticated, isLoading, user: me } = useAuth();
  const { mutate } = useUserUpdateMutation();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  if (isLoading || !isLoaded) return <IonSpinner color="primary" />;

  if (!isAuthenticated) return <Redirect to="/login" />;

  const onRegistration = (token: Token) => {
    if (!me) return;

    if (me.fcmToken === token.value) return;

    mutate({
      ...me,
      fcmToken: token.value,
    });
  };

  useEffect(() => {
    setUpPushNotifications({
      onRegistration,
    });

    return () => {
      cleanUpPushNotifications();
    };
  }, []);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home" component={Home} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/trip/:trip" component={Trip} />
        <Route
          exact
          path="/student/:student/trip/:trip"
          component={StudentTrip}
        />
        <Route render={() => <Redirect to="/home" />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home" onClick={hapticsImpactLight}>
          <IonIcon aria-hidden icon={home} />
          <IonLabel>Página inicial</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="account"
          href="/account"
          onClick={hapticsImpactLight}
        >
          <IonIcon aria-hidden icon={person} />
          <IonLabel>Conta</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Authenticated;
