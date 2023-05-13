import { FC, useEffect } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonText,
} from "@ionic/react";
import { busOutline } from "ionicons/icons";
import { useGetTripsQuery } from "../hooks/useGetTripsQuery";
import { Geolocation } from "@capacitor/geolocation";

const registerGeolocation = async () => {
  const permissionStatus = await Geolocation.checkPermissions();

  if (
    permissionStatus.location === "prompt" &&
    (await Geolocation.requestPermissions()).location !== "granted"
  ) {
    throw new Error("User denied permissions!");
  }
};

export const Driver: FC = () => {
  const { data: trips = [] } = useGetTripsQuery({
    driver: true,
  });

  useEffect(() => {
    registerGeolocation();
  }, []);

  return (
    <div>
      {trips.length === 0 ? (
        <div className="ion-padding">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IonIcon
              icon={busOutline}
              className="ion-margin-end"
              size="large"
            />
          </div>
          <div className="ion-margin-top">
            <IonText className="ion-text-center">
              <h2 className="ion-no-margin">Nenhuma viagem hoje</h2>
            </IonText>
          </div>
        </div>
      ) : (
        <>
          {trips.map((trip) => (
            <IonCard key={trip.id}>
              <IonCardHeader>
                <IonCardTitle>{trip.itinerary.school.name}</IonCardTitle>
                <IonCardSubtitle>
                  {trip.arriveAt.toLocaleTimeString()}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                {trip.itinerary.school.address.description}
              </IonCardContent>
              <IonButton fill="clear" routerLink={`/viagem/${trip.id}`}>
                {trip.startedAt ? "Acompanhar" : "Começar"}
              </IonButton>
            </IonCard>
          ))}
        </>
      )}
    </div>
  );
};
