import { FC } from "react";
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  RefresherEventDetail,
} from "@ionic/react";
import { busOutline } from "ionicons/icons";
import { useStudentsQuery } from "../hooks/useStudentsQuery";
import { useTripStudentPresentMutation } from "../hooks/useTripStudentPresentMutation";
import { useTripStudentAbsentMutation } from "../hooks/useTripStudentAbsentMutation";
import { format } from "date-fns";

const Responsible: FC = () => {
  const {
    data: students = [],
    isLoading: isLoadingStudents,
    refetch,
  } = useStudentsQuery({
    responsible: true,
  });
  const { mutate: absent, isLoading: isMutatingAbsent } =
    useTripStudentAbsentMutation();
  const { mutate: present, isLoading: isMutatingPresent } =
    useTripStudentPresentMutation();

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch();

    event.detail.complete();
  };

  return (
    <div>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      {isLoadingStudents ? (
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
      {students.length === 0 && !isLoadingStudents ? (
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
      {students.length > 0 && !isLoadingStudents ? (
        <>
          {students.map((student) => (
            <>
              <IonList lines="none">
                <IonListHeader>
                  <IonLabel className="ion-no-margin">
                    {student.firstName} {student.lastName}
                  </IonLabel>
                </IonListHeader>
                <IonItem>
                  <IonLabel>
                    <h3>{student.school.name}</h3>
                    <p>{student.school.address.description}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
              {student.trips?.map((trip) => {
                const studentHasNotCompletedTrip = trip.round
                  ? !trip.pivot?.disembarkedAt
                  : !trip.pivot?.embarkedAt;

                return (
                  <IonCard key={trip.id}>
                    <IonCardHeader>
                      <IonCardSubtitle>
                        {trip.round ? "Volta" : "Ida"}
                        {" - "}
                        {trip.finishedAt
                          ? `Finalizada às ${format(trip.finishedAt, "H:mm")}`
                          : `Previsão de chegada às ${format(
                              trip.arriveAt,
                              "H:mm"
                            )}`}
                      </IonCardSubtitle>
                    </IonCardHeader>
                    <div
                      className="ion-padding-bottom ion-padding-horizontal"
                      style={{ display: "flex", justifyContent: "end" }}
                    >
                      {!trip.finishedAt &&
                        studentHasNotCompletedTrip &&
                        !!trip.pivot &&
                        (trip.pivot.absent ? (
                          <IonButton
                            size="small"
                            shape="round"
                            onClick={() => present({ trip, student })}
                          >
                            {isMutatingPresent ? (
                              <IonSpinner name="dots" />
                            ) : (
                              "Irá Comparecer"
                            )}
                          </IonButton>
                        ) : (
                          <IonButton
                            size="small"
                            shape="round"
                            color="danger"
                            onClick={() => absent({ trip, student })}
                          >
                            {isMutatingAbsent ? (
                              <IonSpinner name="dots" />
                            ) : (
                              "Não Irá Comparecer"
                            )}
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
                );
              })}
            </>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default Responsible;
