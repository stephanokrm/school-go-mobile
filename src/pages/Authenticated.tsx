import { FC, useEffect } from "react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import Home from "./Home";
import Tab2 from "./Tab2";
import { home, person } from "ionicons/icons";
import { PushNotifications, Token } from "@capacitor/push-notifications";
import { useUserUpdateMutation } from "../hooks/useUserUpdateMutation";
import { useGetUserByMeQuery } from "../hooks/useGetUserByMeQuery";
import { useAuth } from "../hooks/useAuth";
import Trip from "./Trip";
import StudentTrip from "./StudentTrip";
import { Toast } from "@capacitor/toast";

interface AddPushNotificationsListeners {
  onRegistration: (token: Token) => unknown;
}

const addPushNotificationsListeners = async ({
  onRegistration,
}: AddPushNotificationsListeners) => {
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

export const Authenticated: FC = () => {
  const { mutate } = useUserUpdateMutation();
  const { data: me } = useGetUserByMeQuery();

  useAuth({ middleware: "auth" });

  const onRegistration = (token: Token) => {
    if (!me) return;

    if (me.fcmToken === token.value) return;

    mutate({
      ...me,
      fcmToken: token.value,
    });
  };

  useEffect(() => {
    addPushNotificationsListeners({
      onRegistration,
    }).then(registerPushNotifications);

    return () => {
      PushNotifications.removeAllListeners().then(() =>
        console.log("removeAllListeners")
      );
    };
  }, []);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/pagina-inicial">
          <Home />
        </Route>
        <Route exact path="/conta">
          <Tab2 />
        </Route>
        <Route exact path="/viagem/:id" component={Trip} />
        <Route
          exact
          path="/student/:student/trip/:trip"
          component={StudentTrip}
        />
        <Route exact path="/">
          <Redirect to="/pagina-inicial" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/pagina-inicial">
          <IonIcon aria-hidden="true" icon={home} />
          <IonLabel>Página inicial</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/conta">
          <IonIcon aria-hidden="true" icon={person} />
          <IonLabel>Conta</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};
