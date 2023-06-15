import { FC, useEffect } from "react";
import {
  IonButton,
  IonIcon,
  IonText,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { busOutline, playOutline } from "ionicons/icons";
import { useGetTripsQuery } from "../hooks/useGetTripsQuery";
import { Geolocation } from "@capacitor/geolocation";
import { format } from "date-fns";

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
  const {
    data: trips = [],
    refetch,
    isLoading: isLoadingTrips,
  } = useGetTripsQuery({
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
      {isLoadingTrips ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IonSpinner color="primary" />
        </div>
      ) : null}
      {trips.length === 0 && !isLoadingTrips ? (
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
      ) : null}
      {trips.length > 0 && !isLoadingTrips ? (
        <IonList>
          {trips.map((trip) => (
            <IonItem>
              <IonLabel>
                <h3>
                  {trip.itinerary.school.name} - {trip.round ? "Volta" : "Ida"}
                </h3>
                <p>{trip.itinerary.school.address.description}</p>
                <p>
                  {trip.finishedAt
                    ? `Finalizada às ${format(trip.finishedAt, "H:mm")}`
                    : `Previsão de ${
                        trip.round ? "saída" : "chegada"
                      } às ${format(trip.arriveAt, "H:mm")}`}
                </p>
              </IonLabel>
              {!trip.finishedAt && (
                <IonButton
                  slot="end"
                  size="small"
                  shape="round"
                  color={trip.startedAt ? "success" : "primary"}
                  routerLink={`/trip/${trip.id}`}
                  style={{ height: "30px" }}
                >
                  <IonIcon
                    icon={playOutline}
                    slot="start"
                    style={{ paddingLeft: "5px" }}
                  />
                  {trip.startedAt ? "Continuar" : "Começar"}
                </IonButton>
              )}
            </IonItem>
          ))}
        </IonList>
      ) : null}
    </div>
  );
};

export default Driver;
