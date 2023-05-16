import React, { FC, useEffect, useRef, useState } from "react";
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
  IonButtons,
  IonBackButton,
  useIonViewDidEnter,
  useIonViewWillLeave,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { add, remove, flag, school } from "ionicons/icons";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import "./Trip.css";
import { RouteComponentProps } from "react-router";
import { useTripByIdQuery } from "../hooks/useTripByIdQuery";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { useStudentByIdQuery } from "../hooks/useStudentByIdQuery";

interface TripProps
  extends RouteComponentProps<{ student: string; trip: string }> {}

const StudentTrip: FC<TripProps> = ({ match }) => {
  const mapRef = useRef<HTMLElement>();
  const googleMapRef = useRef<GoogleMap>();
  const driverMarkerRef = useRef<string>();
  const studentMarkerRef = useRef<string>();
  const destinationMarkerRef = useRef<string>();
  const zoomRef = useRef<number>(18);
  const modal = useRef<HTMLIonModalElement>(null);
  const [isGoogleMapCreated, setIsGoogleMapCreated] = useState(false);

  const { height } = useWindowDimensions();
  const { data: student } = useStudentByIdQuery(match.params.student);
  const { data: trip } = useTripByIdQuery(match.params.trip, {
    refetchInterval: 10000,
  });

  const path = trip?.path;
  const destination = trip?.itinerary?.school;
  const driverLatitude = trip?.latitude;
  const driverLongitude = trip?.longitude;
  const studentLongitude = student?.address.longitude;
  const studentLatitude = student?.address.latitude;

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const addMarker = async () => {
      if (!googleMapRef.current || !studentLatitude || !studentLongitude)
        return;

      if (studentMarkerRef.current) {
        await googleMapRef.current.removeMarker(studentMarkerRef.current);
      }

      studentMarkerRef.current = await googleMapRef.current.addMarker({
        coordinate: {
          lat: studentLatitude,
          lng: studentLongitude,
        },
      });
    };

    addMarker();
  }, [studentLatitude, studentLongitude, isGoogleMapCreated]);

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const addMarker = async () => {
      if (!googleMapRef.current || !driverLatitude || !driverLongitude) return;

      if (driverMarkerRef.current) {
        await googleMapRef.current.removeMarker(driverMarkerRef.current);
      }

      driverMarkerRef.current = await googleMapRef.current.addMarker({
        coordinate: {
          lat: driverLatitude,
          lng: driverLongitude,
        },
        iconUrl: "bus.png",
        iconSize: {
          width: zoomRef.current * 3,
          height: zoomRef.current * 3,
        },
      });
    };

    addMarker();
  }, [driverLatitude, driverLongitude, isGoogleMapCreated]);

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const setPadding = async () => {
      if (!googleMapRef.current) return;

      await googleMapRef.current.setPadding({
        left: 0,
        right: 0,
        top: 0,
        bottom: height * 0.25,
      });
    };

    setPadding();
  }, [height, isGoogleMapCreated]);

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const addPolylines = async () => {
      if (!googleMapRef.current || !path) return;

      googleMapRef.current.addPolylines([
        {
          strokeColor: "#ffc409",
          strokeWeight: 15,
          path,
        },
      ]);
    };

    addPolylines();
  }, [path, isGoogleMapCreated]);

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const addMarker = async () => {
      if (!googleMapRef.current || !destination) return;

      if (destinationMarkerRef.current) {
        await googleMapRef.current.removeMarker(destinationMarkerRef.current);
      }

      destinationMarkerRef.current = await googleMapRef.current.addMarker({
        coordinate: {
          lat: destination.address.latitude,
          lng: destination.address.longitude,
        },
        iconSize: {
          width: zoomRef.current,
          height: zoomRef.current,
        },
      });
    };

    addMarker();
  }, [destination, isGoogleMapCreated]);

  const removeZoom = async () => {
    if (!googleMapRef.current) return;

    const zoom = zoomRef.current - 1;

    zoomRef.current = zoom;

    await googleMapRef.current.setCamera({
      animate: true,
      zoom,
    });
  };

  const addZoom = async () => {
    if (!googleMapRef.current) return;

    const zoom = zoomRef.current + 1;

    zoomRef.current = zoom;

    await googleMapRef.current.setCamera({
      animate: true,
      zoom,
    });
  };

  const cleanUp = async () => {
    await googleMapRef.current?.destroy();
    await modal.current?.dismiss();
  };

  const loadMap = async () => {
    if (!mapRef.current) return;

    const currentPosition = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    googleMapRef.current = await GoogleMap.create({
      id: "trip-map",
      element: mapRef.current,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
      config: {
        center: {
          lat: currentPosition.coords.latitude,
          lng: currentPosition.coords.longitude,
        },
        zoom: zoomRef.current,
      },
    });

    await googleMapRef.current.enableCurrentLocation(true);
    await googleMapRef.current.setOnBoundsChangedListener(
      (event) => (zoomRef.current = event.zoom)
    );

    setIsGoogleMapCreated(true);
  };

  useIonViewDidEnter(loadMap);

  useIonViewWillLeave(cleanUp);

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Viagem</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <capacitor-google-map
          ref={mapRef}
          style={{
            display: "inline-block",
            width: "100%",
            height: "100vh",
          }}
        />
        <IonFab slot="fixed" vertical="center" horizontal="start">
          <IonFabButton size="small" onClick={removeZoom}>
            <IonIcon icon={remove} />
          </IonFabButton>
        </IonFab>
        <IonFab slot="fixed" vertical="center" horizontal="end">
          <IonFabButton size="small" onClick={addZoom}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonModal
          backdropBreakpoint={0.5}
          backdropDismiss={false}
          breakpoints={[0.25, 0.5, 0.75]}
          initialBreakpoint={0.25}
          isOpen
          ref={modal}
        >
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonIcon icon={school} color="primary" slot="start" />
                <IonLabel>
                  <h2>
                    {student?.firstName} {student?.lastName}
                  </h2>
                  <p>{student?.address.description}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={flag} color="primary" slot="start" />
                <IonLabel>
                  <h2>{destination?.name}</h2>
                  <p>{destination?.address.description}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default StudentTrip;
