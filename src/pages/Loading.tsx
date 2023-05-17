import { IonContent, IonPage, IonSpinner } from "@ionic/react";

export const Loading = () => {
  return (
    <IonPage>
      <IonContent fullscreen style={{ height: "100vh" }}>
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IonSpinner color="primary" />
        </div>
      </IonContent>
    </IonPage>
  );
};
