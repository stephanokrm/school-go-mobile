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
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
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

const Driver: FC = () => {
  const { data: trips = [], refetch } = useGetTripsQuery({
    driver: true,
  });

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch();

    event.detail.complete();
  };

  useEffect(() => {
    registerGeolocation();
  }, []);

  return (
    <div>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
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
                  {trip.round ? "Volta" : "Ida"}
                  {" - "}
                  {trip.finishedAt
                    ? `Finalizada às ${new Intl.DateTimeFormat("default", {
                        hour: "numeric",
                        minute: "numeric",
                      }).format(trip.finishedAt)}`
                    : `Previsão de chegada às ${new Intl.DateTimeFormat(
                        "default",
                        {
                          hour: "numeric",
                          minute: "numeric",
                        }
                      ).format(trip.arriveAt)}`}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                {trip.itinerary.school.address.description}
              </IonCardContent>
              {!trip.finishedAt && (
                <div
                  className="ion-padding-bottom ion-padding-horizontal"
                  style={{ display: "flex", justifyContent: "end" }}
                >
                  <IonButton
                    size="small"
                    shape="round"
                    color={trip.startedAt ? "success" : "primary"}
                    routerLink={`/trip/${trip.id}`}
                  >
                    {trip.startedAt ? "Continuar" : "Começar"}
                  </IonButton>
                </div>
              )}
            </IonCard>
          ))}
        </>
      )}
    </div>
  );
};

export default Driver;
