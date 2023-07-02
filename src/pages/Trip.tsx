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
  IonIcon,
  IonSpinner,
  IonButton,
} from "@ionic/react";
import {
  flagOutline,
  enterOutline,
  exitOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation, CallbackID } from "@capacitor/geolocation";
import "./Trip.css";
import { RouteComponentProps, useHistory } from "react-router";
import { useTripByIdQuery } from "../hooks/useTripByIdQuery";
import { useTripUpdateMutation } from "../hooks/useTripUpdateMutation";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { useTripStudentEmbarkMutation } from "../hooks/useTripStudentEmbarkMutation";
import { useTripStudentDisembarkMutation } from "../hooks/useTripStudentDisembarkMutation";
import { useTripStartMutation } from "../hooks/useTripStartMutation";
import { useTripEndMutation } from "../hooks/useTripEndMutation";

interface TripProps extends RouteComponentProps<{ trip: string }> {}

const Trip: FC<TripProps> = ({ match }) => {
  const history = useHistory();
  const watchRef = useRef<CallbackID>();
  const mapRef = useRef<HTMLElement>();
  const googleMapRef = useRef<GoogleMap>();
  const driverMarkerRef = useRef<string>();
  const destinationMarkerRef = useRef<string>();
  const studentMarkersRef = useRef<string[]>([]);
  const polylinesRef = useRef<string[]>([]);
  const zoomRef = useRef<number>(15);
  const modalRef = useRef<HTMLIonModalElement>(null);
  const [isGoogleMapCreated, setIsGoogleMapCreated] = useState(false);

  const { height } = useWindowDimensions();
  const { data: trip, isLoading: isLoadingTrip } = useTripByIdQuery(
    match.params.trip,
    {
      refetchInterval: 1000,
    }
  );
  const { mutate: update } = useTripUpdateMutation();
  const { mutate: embark, isLoading: isMutatingEmbark } =
    useTripStudentEmbarkMutation();
  const { mutate: disembark, isLoading: isMutatingDisembark } =
    useTripStudentDisembarkMutation();
  const { mutate: start } = useTripStartMutation();
  const { mutate: end } = useTripEndMutation();

  const path = trip?.path;
  const round = trip?.round;
  const latitude = trip?.latitude;
  const longitude = trip?.longitude;
  const itinerary = trip?.itinerary;
  const school = itinerary?.school;
  const destinationName = round ? "Pátio" : school?.name;
  const destinationAddress = round ? itinerary?.address : school?.address;
  const students = trip?.students?.filter((student) => !student.pivot?.absent);
  const completedAllStops = students?.every((student) =>
    round ? !!student.pivot?.disembarkedAt : !!student.pivot?.embarkedAt
  );
  const shouldDisplayDotsSpinner = isMutatingEmbark || isMutatingDisembark;

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const addMarker = async () => {
      if (!googleMapRef.current || !latitude || !longitude) return;

      if (driverMarkerRef.current) {
        await googleMapRef.current.removeMarker(driverMarkerRef.current);
      }

      driverMarkerRef.current = await googleMapRef.current.addMarker({
        coordinate: {
          lat: latitude,
          lng: longitude,
        },
        iconUrl: "bus.png",
        iconSize: {
          width: zoomRef.current * 3,
          height: zoomRef.current * 3,
        },
      });

      await googleMapRef.current.setCamera({
        animate: true,
        coordinate: {
          lat: latitude,
          lng: longitude,
        },
      });
    };

    addMarker();
  }, [latitude, longitude, isGoogleMapCreated]);

  useEffect(() => {
    const startTrip = async () => {
      if (!trip || trip.startedAt) return;

      start(trip);
    };
    const watchPosition = async () => {
      if (!trip) return;

      if (watchRef.current) {
        await Geolocation.clearWatch({ id: watchRef.current });
      }

      watchRef.current = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
        },
        (position) => {
          if (!position) return;

          if (
            trip.longitude !== position.coords.longitude ||
            trip.latitude !== position.coords.latitude
          ) {
            update({
              ...trip,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        }
      );
    };

    startTrip();
    watchPosition();
  }, [trip]);

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

      if (polylinesRef.current.length > 0) {
        await googleMapRef.current.removePolylines(polylinesRef.current);
      }

      const zoom = zoomRef.current - 10;
      const strokeWeight = zoom < 1 ? 1 : zoom;

      polylinesRef.current = await googleMapRef.current.addPolylines([
        {
          path,
          strokeColor: "#ffc409",
          strokeWeight,
        },
      ]);
    };

    addPolylines();
  }, [path, isGoogleMapCreated]);

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const addMarkers = async () => {
      if (!googleMapRef.current || !students) return;

      if (studentMarkersRef.current.length > 0) {
        await googleMapRef.current.removeMarkers(studentMarkersRef.current);
      }

      const markers = students
        .filter((student) =>
          round ? !student.pivot?.disembarkedAt : !student.pivot?.embarkedAt
        )
        .map((student) => ({
          coordinate: {
            lat: student.address.latitude,
            lng: student.address.longitude,
          },
          iconSize: {
            width: zoomRef.current,
            height: zoomRef.current,
          },
        }));

      studentMarkersRef.current = await googleMapRef.current.addMarkers(
        markers
      );
    };

    addMarkers();
  }, [round, students, isGoogleMapCreated]);

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const addMarker = async () => {
      if (!googleMapRef.current || !destinationAddress) return;

      if (destinationMarkerRef.current) {
        await googleMapRef.current.removeMarker(destinationMarkerRef.current);
      }

      destinationMarkerRef.current = await googleMapRef.current.addMarker({
        coordinate: {
          lat: destinationAddress.latitude,
          lng: destinationAddress.longitude,
        },
        iconUrl: "finish.png",
        iconSize: {
          width: zoomRef.current * 2,
          height: zoomRef.current * 2,
        },
      });
    };

    addMarker();
  }, [destinationAddress, isGoogleMapCreated]);

  const cleanUp = async () => {
    await googleMapRef.current?.destroy();
    await modalRef.current?.dismiss();

    if (!watchRef.current) return;

    await Geolocation.clearWatch({ id: watchRef.current });
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

  const destinationItem = (
    <IonItem>
      <IonLabel>
        <h2>{destinationName}</h2>
        <p>{destinationAddress?.description}</p>
      </IonLabel>
      {completedAllStops ? (
        <IonButton
          slot="end"
          color="success"
          shape="round"
          size="small"
          style={{ height: "30px" }}
          onClick={async () => {
            if (!trip) return;

            end(trip);

            await cleanUp();

            history.push("/tabs/home");
          }}
        >
          <IonIcon
            icon={flagOutline}
            slot="start"
            style={{ paddingLeft: "5px" }}
          />
          Finalizar
        </IonButton>
      ) : (
        <IonIcon icon={flagOutline} color="primary" slot="end" />
      )}
    </IonItem>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Voltar" />
          </IonButtons>
          <IonTitle>Viagem</IonTitle>
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
              <IonList>
                {completedAllStops && destinationItem}
                {students?.map((student, index) => {
                  const studentHasCompletedTrip = round
                    ? !!student.pivot?.disembarkedAt
                    : !!student.pivot?.embarkedAt;

                  const isNextStudent = index === 0;
                  const shouldDisplayActionButton =
                    isNextStudent && !studentHasCompletedTrip;

                  return (
                    <IonItem>
                      <IonLabel>
                        <h2>
                          {student.firstName} {student.lastName}
                        </h2>
                        <p>{student.address.description}</p>
                      </IonLabel>
                      {shouldDisplayActionButton ? (
                        <IonButton
                          slot="end"
                          color="primary"
                          shape="round"
                          size="small"
                          style={{ height: "30px" }}
                          onClick={() => {
                            if (!trip) return;

                            round
                              ? disembark({ trip, student })
                              : embark({ trip, student });
                          }}
                        >
                          {shouldDisplayDotsSpinner ? (
                            <IonSpinner name="dots" />
                          ) : (
                            <>
                              <IonIcon
                                icon={round ? exitOutline : enterOutline}
                                slot="start"
                                style={{ paddingLeft: "5px" }}
                              />
                              {round ? "Desembarcou" : "Embarcou"}
                            </>
                          )}
                        </IonButton>
                      ) : studentHasCompletedTrip ? (
                        <IonIcon
                          icon={checkmarkCircleOutline}
                          color="primary"
                          slot="end"
                        />
                      ) : null}
                    </IonItem>
                  );
                })}
                {!completedAllStops && destinationItem}
              </IonList>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Trip;
