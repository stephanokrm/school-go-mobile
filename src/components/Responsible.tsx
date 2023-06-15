import { FC } from "react";
import {
  IonButton,
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
import {
  busOutline,
  eyeOutline,
  checkmarkOutline,
  closeOutline,
} from "ionicons/icons";
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
            <IonList>
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
              {student.trips?.map((trip) => {
                const studentHasNotCompletedTrip = trip.round
                  ? !trip.pivot?.disembarkedAt
                  : !trip.pivot?.embarkedAt;

                return (
                  <IonItem>
                    <IonLabel>
                      <h3>{trip.round ? "Volta" : "Ida"}</h3>
                      <p>
                        {trip.finishedAt
                          ? `Finalizada às ${format(trip.finishedAt, "H:mm")}`
                          : `Previsão de ${
                              trip.round ? "saída" : "chegada"
                            } às ${format(trip.arriveAt, "H:mm")}`}
                      </p>
                    </IonLabel>
                    {studentHasNotCompletedTrip ? (
                      trip.pivot?.absent ? (
                        <IonButton
                          slot="end"
                          size="small"
                          shape="round"
                          style={{ height: "30px" }}
                          onClick={() => present({ trip, student })}
                        >
                          {isMutatingPresent ? (
                            <IonSpinner name="dots" />
                          ) : (
                            <>
                              <IonIcon
                                icon={checkmarkOutline}
                                slot="start"
                                style={{ paddingLeft: "5px" }}
                              />
                              Presente
                            </>
                          )}
                        </IonButton>
                      ) : (
                        <IonButton
                          slot="end"
                          size="small"
                          shape="round"
                          color="danger"
                          style={{ height: "30px" }}
                          onClick={() => absent({ trip, student })}
                        >
                          {isMutatingAbsent ? (
                            <IonSpinner name="dots" />
                          ) : (
                            <>
                              <IonIcon
                                icon={closeOutline}
                                slot="start"
                                style={{ paddingLeft: "5px" }}
                              />
                              Ausente
                            </>
                          )}
                        </IonButton>
                      )
                    ) : null}
                    {trip.startedAt &&
                      !trip.finishedAt &&
                      !trip.pivot?.absent && (
                        <IonButton
                          slot="end"
                          size="small"
                          shape="round"
                          color="success"
                          style={{ height: "30px" }}
                          routerLink={`/student/${student.id}/trip/${trip.id}`}
                        >
                          <IonIcon
                            icon={eyeOutline}
                            slot="start"
                            style={{ paddingLeft: "5px" }}
                          />
                          Acompanhar
                        </IonButton>
                      )}
                  </IonItem>
                );
              })}
            </IonList>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default Responsible;
