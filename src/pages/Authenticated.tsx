import { FC, useEffect } from "react";
import { IonRouterOutlet, IonSpinner } from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import { PushNotifications, Token } from "@capacitor/push-notifications";
import { useUserUpdateMutation } from "../hooks/useUserUpdateMutation";
import { useAuth } from "../hooks/useAuth";
import { Toast } from "@capacitor/toast";
import Trip from "./Trip";
import StudentTrip from "./StudentTrip";
import { Tabs } from "./Tabs";

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

const Authenticated: FC = () => {
  const { isAuthenticated, isLoading, user: me } = useAuth();
  const { mutate } = useUserUpdateMutation();

  if (isLoading) return <IonSpinner color="primary" />;

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
    <IonRouterOutlet id="main">
      <Route path="/tabs" component={Tabs} />
      <Route exact path="/trip/:trip" component={Trip} />
      <Route
        exact
        path="/student/:student/trip/:trip"
        component={StudentTrip}
      />
      <Route render={() => <Redirect to="/tabs" />} />
    </IonRouterOutlet>
  );
};

export default Authenticated;
