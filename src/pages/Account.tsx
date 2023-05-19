import { FC } from "react";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAuth } from "../hooks/useAuth";
import { useLogoutMutation } from "../hooks/useLogoutMutation";

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
          <IonItem onClick={() => logout()}>
            <IonLabel color="danger">Sair</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Account;
