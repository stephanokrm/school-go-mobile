import React, { FC, useEffect, useRef, useState } from "react";
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonBackButton,
  useIonViewDidEnter,
  useIonViewWillLeave,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonModal,
  IonText,
} from "@ionic/react";
import {
  flagOutline,
  checkmarkCircleOutline,
  busOutline,
} from "ionicons/icons";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation } from "@capacitor/geolocation";
import "./Trip.css";
import { RouteComponentProps } from "react-router";
import { useTripByIdQuery } from "../hooks/useTripByIdQuery";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

interface TripProps
  extends RouteComponentProps<{ student: string; trip: string }> {}

const StudentTrip: FC<TripProps> = ({ match }) => {
  const mapRef = useRef<HTMLElement>();
  const googleMapRef = useRef<GoogleMap>();
  const driverMarkerRef = useRef<string>();
  const originMarkerRef = useRef<string>();
  const destinationMarkerRef = useRef<string>();
  const zoomRef = useRef<number>(15);
  const modal = useRef<HTMLIonModalElement>(null);
  const [isGoogleMapCreated, setIsGoogleMapCreated] = useState(false);
  const modalRef = useRef<HTMLIonModalElement>(null);
  const { height } = useWindowDimensions();
  const { data: trip, isLoading: isLoadingTrip } = useTripByIdQuery(
    match.params.trip,
    {
      refetchInterval: 1000,
    }
  );

  const student = trip?.students?.find(
    (student) => student.id.toString() === match.params.student
  );
  const round = trip?.round;
  const studentHasCompletedTrip = round
    ? !!student?.pivot?.disembarkedAt
    : !!student?.pivot?.embarkedAt;
  const studentHasStartedTrip = !!student?.pivot?.embarkedAt;
  const school = trip?.itinerary?.school;
  const originAddress = round ? school?.address : student?.address;
  const destinationAddress = round ? student?.address : school?.address;
  const driverLatitude = trip?.latitude;
  const driverLongitude = trip?.longitude;
  const originLatitude = originAddress?.latitude;
  const originLongitude = originAddress?.longitude;
  const destinationLatitude = destinationAddress?.latitude;
  const destinationLongitude = destinationAddress?.longitude;

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const addMarker = async () => {
      if (!googleMapRef.current || !originLatitude || !originLongitude) return;

      if (originMarkerRef.current) {
        await googleMapRef.current.removeMarker(originMarkerRef.current);
      }

      if (studentHasCompletedTrip) return;

      originMarkerRef.current = await googleMapRef.current.addMarker({
        coordinate: {
          lat: originLatitude,
          lng: originLongitude,
        },
      });
    };

    addMarker();
  }, [
    studentHasCompletedTrip,
    originLatitude,
    originLongitude,
    isGoogleMapCreated,
  ]);

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

    const setCamera = async () => {
      if (
        !googleMapRef.current ||
        !driverLatitude ||
        !driverLongitude ||
        !originLatitude ||
        !originLongitude ||
        !destinationLatitude ||
        !destinationLongitude
      )
        return;

      const driver = new google.maps.LatLng(driverLatitude, driverLongitude);
      const from = new google.maps.LatLng(originLatitude, originLongitude);
      const to = new google.maps.LatLng(
        destinationLatitude,
        destinationLongitude
      );

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(driver);
      bounds.extend(to);

      if (!studentHasCompletedTrip) {
        bounds.extend(from);
      }

      const center = bounds.getCenter();

      const area = window.google.maps.geometry.spherical.computeArea([
        ...(studentHasCompletedTrip ? [] : [from]),
        to,
        driver,
      ]);

      await googleMapRef.current.setCamera({
        animate: true,
        zoom: 75 / area,
        coordinate: {
          lat: center.lat(),
          lng: center.lng(),
        },
      });
    };

    setCamera();
  }, [
    driverLatitude,
    driverLongitude,
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude,
    studentHasCompletedTrip,
    isGoogleMapCreated,
  ]);

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

    const addMarker = async () => {
      if (
        !googleMapRef.current ||
        !destinationLatitude ||
        !destinationLongitude
      )
        return;

      if (destinationMarkerRef.current) {
        await googleMapRef.current.removeMarker(destinationMarkerRef.current);
      }

      destinationMarkerRef.current = await googleMapRef.current.addMarker({
        coordinate: {
          lat: destinationLatitude,
          lng: destinationLongitude,
        },
        iconUrl: "finish.png",
        iconSize: {
          width: zoomRef.current * 2,
          height: zoomRef.current * 2,
        },
      });
    };

    addMarker();
  }, [destinationLatitude, destinationLongitude, isGoogleMapCreated]);

  const cleanUp = async () => {
    await googleMapRef.current?.destroy();
    await modal.current?.dismiss();
  };

  const loadMap = async () => {
    if (!mapRef.current) return;

    await window.google.maps.importLibrary("geometry");

    const currentPosition = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    googleMapRef.current = await GoogleMap.create({
      id: "trip-map",
      element: mapRef.current,
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
      config: {
        gestureHandling: "none",
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        scrollwheel: false,
        zoomControl: false,
        center: {
          lat: currentPosition.coords.latitude,
          lng: currentPosition.coords.longitude,
        },
        zoom: zoomRef.current,
      },
    });

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
            <IonBackButton text="Voltar" />
          </IonButtons>
          <IonTitle>
            {isLoadingTrip ? (
              <IonSpinner name="dots" />
            ) : (
              `Viagem de ${student?.firstName}`
            )}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="trip">
        <capacitor-google-map
          ref={mapRef}
          style={{
            display: "inline-block",
            width: "100%",
            height: "100vh",
          }}
        />
        <IonModal
          backdropBreakpoint={0.5}
          backdropDismiss={false}
          breakpoints={[0.25, 0.5, 0.75]}
          initialBreakpoint={0.25}
          isOpen
          ref={modalRef}
        >
          <IonContent className="ion-padding">
            {isLoadingTrip ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <IonSpinner name="dots" />
              </div>
            ) : (
              <div>
                <div>
                  <IonText>
                    <h5>
                      {studentHasStartedTrip
                        ? `${student?.firstName} está à caminho`
                        : `${student?.firstName} está aguardando o embarque`}
                    </h5>
                  </IonText>
                </div>
                <div>
                  <IonList>
                    <IonItem>
                      <IonIcon icon={checkmarkCircleOutline} slot="start" />
                      <IonLabel>
                        <p>Endereço de Origem</p>
                        <h3>{originAddress?.description}</h3>
                      </IonLabel>
                    </IonItem>
                    <IonItem lines="full">
                      <IonIcon icon={flagOutline} slot="start" />
                      <IonLabel>
                        <p>Endereço de Destino</p>
                        <h3>{destinationAddress?.description}</h3>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonIcon icon={busOutline} slot="start" />
                      <IonLabel>
                        <p>Motorista</p>
                        <h3>
                          {trip?.itinerary.driver.user.firstName}{" "}
                          {trip?.itinerary.driver.user.lastName}
                        </h3>
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </div>
              </div>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default StudentTrip;
