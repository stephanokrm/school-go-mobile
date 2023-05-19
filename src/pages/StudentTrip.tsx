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
} from "@ionic/react";
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

  const round = trip?.round;
  const itinerary = trip?.itinerary;
  const destinationAddress = round
    ? itinerary?.address
    : itinerary?.school?.address;
  const driverLatitude = trip?.latitude;
  const driverLongitude = trip?.longitude;
  const destinationLatitude = destinationAddress?.latitude;
  const destinationLongitude = destinationAddress?.longitude;
  const studentAddress = student?.address;
  const studentLongitude = studentAddress?.longitude;
  const studentLatitude = studentAddress?.latitude;

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

    const setCamera = async () => {
      if (
        !googleMapRef.current ||
        !driverLatitude ||
        !driverLongitude ||
        !destinationLatitude ||
        !destinationLongitude
      )
        return;

      const from = { lat: driverLatitude, lng: driverLongitude };
      const to = {
        lat: destinationLatitude,
        lng: destinationLongitude,
      };
      const center = new window.google.maps.LatLngBounds(from, to).getCenter();
      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(from, to);

      console.log({ distance });

      await googleMapRef.current?.setCamera({
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
    destinationLatitude,
    destinationLongitude,
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
        bottom: 0,
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
        iconSize: {
          width: zoomRef.current,
          height: zoomRef.current,
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
            <IonBackButton text="Voltar" />
          </IonButtons>
          <IonTitle>
            {student?.firstName} {student?.lastName}
          </IonTitle>
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
      </IonContent>
    </IonPage>
  );
};

export default StudentTrip;
