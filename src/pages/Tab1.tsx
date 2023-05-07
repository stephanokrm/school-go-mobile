import { FC, useRef, useState } from "react";
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
import "./Tab1.css";
import { useAuth } from "../hooks/useAuth";
import { RoleEnum } from "../enums/Role";
import { Role } from "../components/Role";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Clock } from "../components/Clock";
import { useGreeting } from "../hooks/useGreeting";
import { GoogleMap } from "@capacitor/google-maps";

const Tab1: FC = () => {
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

  const mapRef = useRef<HTMLElement>();

  async function createMap() {
    if (!mapRef.current) return;

    console.log({ mapRef: mapRef.current });

    await GoogleMap.create({
      id: "my-cool-map",
      element: mapRef.current,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
      forceCreate: true,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 8,
      },
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {isDriverAndResponsible ? (
            <IonSegment value={segment} onIonChange={onSegmentChange}>
              <IonSegmentButton value={RoleEnum.Driver}>
                <IonLabel>Motorista</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value={RoleEnum.Responsible}>
                <IonLabel>Responsável</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          ) : (
            <IonTitle>{role}</IonTitle>
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
              <Clock />
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
        <button onClick={createMap}>Create Map</button>
        <capacitor-google-map
          ref={mapRef}
          style={{
            display: "inline-block",
            width: 275,
            height: 400,
          }}
        ></capacitor-google-map>
        <Role role={isDriverAndResponsible ? segment : role} />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
