import { FC, useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  SegmentChangeEventDetail,
} from "@ionic/react";
import { IonSegmentCustomEvent } from "@ionic/core";
import { useAuth } from "../hooks/useAuth";
import { RoleEnum } from "../enums/Role";
import { Role } from "../components/Role";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Clock } from "../components/Clock";
import { useGreeting } from "../hooks/useGreeting";
import { useHistory } from "react-router";

const Home: FC = () => {
  const { user } = useAuth({ middleware: "auth" });
  const [segment, setSegment] = useState(RoleEnum.Driver);
  const { label: greetingLabel, icon: greetingIcon } = useGreeting();

  const roles: RoleEnum[] = user?.roles
    ?.filter(({ role }) => role !== RoleEnum.Administrator)
    ?.map(({ role }) => role) ?? [RoleEnum.Administrator];
  const isDriver = roles?.includes(RoleEnum.Driver) ?? false;
  const isResponsible = roles?.includes(RoleEnum.Responsible) ?? false;
  const isDriverAndResponsible = isDriver && isResponsible;
  const [role] = roles.length === 0 ? [RoleEnum.Administrator] : roles;

  const onSegmentChange = async (
    event: IonSegmentCustomEvent<SegmentChangeEventDetail>
  ) => {
    await Haptics.impact({ style: ImpactStyle.Light });

    setSegment(event.detail.value as RoleEnum);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isDriverAndResponsible ? (
            <IonSegment value={segment} onIonChange={onSegmentChange}>
              <IonSegmentButton value={RoleEnum.Driver}>
                <IonLabel>
                  Motorista - <Clock />
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value={RoleEnum.Responsible}>
                <IonLabel>
                  Responsável - <Clock />
                </IonLabel>
              </IonSegmentButton>
            </IonSegment>
          ) : (
            <IonTitle>
              {role} - <Clock />
            </IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!isDriverAndResponsible && (
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{role}</IonTitle>
            </IonToolbar>
          </IonHeader>
        )}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <IonText>
                    <h6 className="ion-no-margin">{greetingLabel},</h6>
                  </IonText>
                  <IonText>
                    <h1
                      className="ion-no-margin"
                      style={{ display: "flex", alignContent: "center" }}
                    >
                      {user?.firstName}
                    </h1>
                  </IonText>
                </div>
                <IonIcon
                  icon={greetingIcon}
                  className="ion-margin-end"
                  size="large"
                />
              </div>
            </IonCardTitle>
            <IonCardSubtitle>
              <Clock options={{ day: "numeric", month: "short" }} />
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        <Role role={isDriverAndResponsible ? segment : role} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
