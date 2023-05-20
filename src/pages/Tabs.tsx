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
import Account from "./Account";
import { homeOutline, personOutline } from "ionicons/icons";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { useEffect } from "react";
import { PushNotifications, Token } from "@capacitor/push-notifications";
import { Toast } from "@capacitor/toast";
import { useAuth } from "../hooks/useAuth";
import { useUserUpdateMutation } from "../hooks/useUserUpdateMutation";

interface SetUpPushNotifications {
  onRegistration: (token: Token) => unknown;
}

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

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

export const Tabs = () => {
  const { user: me } = useAuth();
  const { mutate } = useUserUpdateMutation();

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
        <Route exact path="/tabs/home" component={Home} />
        <Route exact path="/tabs/account" component={Account} />
        <Route render={() => <Redirect to="/tabs/home" />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home" onClick={hapticsImpactLight}>
          <IonIcon aria-hidden icon={homeOutline} />
          <IonLabel>Página inicial</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="account"
          href="/tabs/account"
          onClick={hapticsImpactLight}
        >
          <IonIcon aria-hidden icon={personOutline} />
          <IonLabel>Conta</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};
