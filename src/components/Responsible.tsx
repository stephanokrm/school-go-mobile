import { FC } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonLabel,
  IonList,
  IonListHeader,
  IonText,
} from "@ionic/react";
import { busOutline } from "ionicons/icons";
import { useStudentsQuery } from "../hooks/useStudentsQuery";

export const Responsible: FC = () => {
  const { data: students = [] } = useStudentsQuery({
    responsible: true,
  });

  return (
    <div>
      {students.length === 0 ? (
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
          {students.map((student) => (
            <>
              <IonList>
                <IonListHeader>
                  <IonLabel>
                    {student.firstName} {student.lastName}
                  </IonLabel>
                </IonListHeader>
              </IonList>
              {student.trips?.map((trip) => (
                <IonCard key={trip.id}>
                  <IonCardHeader>
                    <IonCardTitle>{trip.itinerary.school.name}</IonCardTitle>
                    <IonCardSubtitle>
                      {trip.finishedAt
                        ? `Finalizada às ${trip.finishedAt.toLocaleTimeString()}`
                        : trip.arriveAt.toLocaleTimeString()}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {trip.itinerary.school.address.description}
                  </IonCardContent>
                  {!trip.finishedAt && trip.startedAt && (
                    <IonButton
                      fill="clear"
                      routerLink={`/student/${student.id}/trip/${trip.id}`}
                    >
                      Acompanhar
                    </IonButton>
                  )}
                </IonCard>
              ))}
            </>
          ))}
        </>
      )}
    </div>
  );
};
