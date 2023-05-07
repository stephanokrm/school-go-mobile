import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab2.css";
import { useAuth } from "../hooks/useAuth";

const Tab2: React.FC = () => {
  const { user } = useAuth({ middleware: "auth" });

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
        <ExploreContainer name="Tab 2 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
