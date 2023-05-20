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
  IonRefresher,
  IonRefresherContent,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import { busOutline } from "ionicons/icons";
import { useStudentsQuery } from "../hooks/useStudentsQuery";
import { useTripStudentPresentMutation } from "../hooks/useTripStudentPresentMutation";
import { useTripStudentAbsentMutation } from "../hooks/useTripStudentAbsentMutation";

const Responsible: FC = () => {
  const { data: students = [], refetch } = useStudentsQuery({
    responsible: true,
  });
  const { mutate: absent } = useTripStudentAbsentMutation();
  const { mutate: present } = useTripStudentPresentMutation();

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch();

    event.detail.complete();
  };

  return (
    <div>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
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
                  <div
                    className="ion-padding-bottom ion-padding-horizontal"
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    {!trip.finishedAt &&
                      !trip.pivot?.embarkedAt &&
                      !!trip.pivot &&
                      (trip.pivot.absent ? (
                        <IonButton
                          size="small"
                          shape="round"
                          onClick={() => present({ trip, student })}
                        >
                          Irá Comparecer
                        </IonButton>
                      ) : (
                        <IonButton
                          size="small"
                          shape="round"
                          color="danger"
                          onClick={() => absent({ trip, student })}
                        >
                          Não Irá Comparecer
                        </IonButton>
                      ))}
                    {!trip.finishedAt &&
                      trip.startedAt &&
                      !trip.pivot?.absent && (
                        <IonButton
                          size="small"
                          shape="round"
                          color="success"
                          routerLink={`/student/${student.id}/trip/${trip.id}`}
                        >
                          Acompanhar
                        </IonButton>
                      )}
                  </div>
                </IonCard>
              ))}
            </>
          ))}
        </>
      )}
    </div>
  );
};

export default Responsible;
