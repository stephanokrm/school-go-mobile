import { FC } from "react";
import { useGetItinerariesQuery } from "../hooks/useGetItinerariesQuery";
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonText,
} from "@ionic/react";
import { busOutline } from "ionicons/icons";

export const Driver: FC = () => {
  const { data: itineraries = [] } = useGetItinerariesQuery({
    driver: true,
  });

  return (
    <div>
      {itineraries.length === 0 ? (
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
              <h2 className="ion-no-margin">Nenhum itinerário para hoje</h2>
            </IonText>
          </div>
        </div>
      ) : (
        <>
          {itineraries.map((itinerary) => (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{itinerary.school.name}</IonCardTitle>
                <IonCardSubtitle>
                  {itinerary.school.address.description}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonButton fill="clear">Começar</IonButton>
            </IonCard>
          ))}
        </>
      )}
    </div>
  );
};
