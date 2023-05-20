import { FC } from "react";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuth } from "../hooks/useAuth";
import { useLogoutMutation } from "../hooks/useLogoutMutation";
import { logOutOutline, mailOutline, callOutline } from "ionicons/icons";

const Account: FC = () => {
  const { user } = useAuth();
  const { mutate: logout } = useLogoutMutation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {user?.firstName} {user?.lastName}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              {user?.firstName} {user?.lastName}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonIcon icon={mailOutline} slot="start" />
            <IonLabel>{user?.email}</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={callOutline} slot="start" />
            <IonLabel>{user?.cellPhone}</IonLabel>
          </IonItem>
          <IonItem lines="full" onClick={() => logout()}>
            <IonIcon icon={logOutOutline} slot="start" color="danger" />
            <IonLabel color="danger">Sair</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Account;
