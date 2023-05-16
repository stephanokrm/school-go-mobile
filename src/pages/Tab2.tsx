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
import "./Tab2.css";
import { useAuth } from "../hooks/useAuth";
import { useLogoutMutation } from "../hooks/useLogoutMutation";

const Tab2: React.FC = () => {
  const { user } = useAuth({ middleware: "auth" });

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

export default Tab2;
