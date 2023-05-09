import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonImg,
  IonSearchbar,
  IonButtons,
  IonBackButton,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation, CallbackID } from "@capacitor/geolocation";
import "./Trip.css";

const Trip: FC<PropsWithChildren> = ({ children }) => {
  const watchRef = useRef<CallbackID>();
  const mapRef = useRef<HTMLElement>();
  const googleMapRef = useRef<GoogleMap>();
  const modal = useRef<HTMLIonModalElement>(null);
  const [isReady, setIsReady] = useState(false);

  const loadMap = async () => {
    if (!mapRef.current) return;

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    googleMapRef.current = await GoogleMap.create({
      id: "trip-map",
      element: mapRef.current,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
      config: {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        zoom: 8,
      },
    });

    watchRef.current = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
      },
      (position) => {
        if (!googleMapRef.current || !position) return;

        googleMapRef.current?.setCamera({
          animate: true,
          coordinate: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      }
    );
  };

  useIonViewDidEnter(() => setIsReady(true));

  useIonViewWillLeave(() => {
    googleMapRef.current?.destroy();
    modal.current?.dismiss();

    if (!watchRef.current) return;

    Geolocation.clearWatch({
      id: watchRef.current,
    }).then(() => console.log("Clear Watch"));
  });

  useEffect(() => {
    if (!isReady) return;

    loadMap();
  }, [isReady]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isReady && (
          <capacitor-google-map
            ref={mapRef}
            style={{
              display: "inline-block",
              width: "100%",
              height: "70vh",
            }}
          />
        )}
        <IonModal
          ref={modal}
          trigger="open-modal"
          isOpen={true}
          initialBreakpoint={0.25}
          breakpoints={[0.25, 0.5, 0.75]}
          backdropDismiss={false}
          backdropBreakpoint={0.5}
        >
          <IonContent className="ion-padding">
            <IonSearchbar
              onClick={() => modal.current?.setCurrentBreakpoint(0.75)}
              placeholder="Search"
            ></IonSearchbar>
            {children}
            <IonList>
              <IonItem>
                <IonAvatar slot="start">
                  <IonImg src="https://i.pravatar.cc/300?u=b" />
                </IonAvatar>
                <IonLabel>
                  <h2>Connor Smith</h2>
                  <p>Sales Rep</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonAvatar slot="start">
                  <IonImg src="https://i.pravatar.cc/300?u=a" />
                </IonAvatar>
                <IonLabel>
                  <h2>Daniel Smith</h2>
                  <p>Product Designer</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonAvatar slot="start">
                  <IonImg src="https://i.pravatar.cc/300?u=d" />
                </IonAvatar>
                <IonLabel>
                  <h2>Greg Smith</h2>
                  <p>Director of Operations</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonAvatar slot="start">
                  <IonImg src="https://i.pravatar.cc/300?u=e" />
                </IonAvatar>
                <IonLabel>
                  <h2>Zoey Smith</h2>
                  <p>CEO</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Trip;
