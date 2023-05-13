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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonChip,
  IonSpinner,
} from "@ionic/react";
import { add, remove, checkmarkCircle, arrowForward } from "ionicons/icons";
import { GoogleMap } from "@capacitor/google-maps";
import { Geolocation, CallbackID } from "@capacitor/geolocation";
import "./Trip.css";
import { RouteComponentProps } from "react-router";
import { useTripByIdQuery } from "../hooks/useTripByIdQuery";
import { useTripUpdateMutation } from "../hooks/useTripUpdateMutation";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

interface TripProps extends RouteComponentProps<{ id: string }> {}

const Trip: FC<TripProps> = ({ match }) => {
  const watchRef = useRef<CallbackID>();
  const mapRef = useRef<HTMLElement>();
  const googleMapRef = useRef<GoogleMap>();
  const driverMarkerRef = useRef<string>();
  const destinationMarkerRef = useRef<string>();
  const studentMarkersRef = useRef<string[]>([]);
  const zoomRef = useRef<number>(18);
  const modal = useRef<HTMLIonModalElement>(null);
  const [isGoogleMapCreated, setIsGoogleMapCreated] = useState(false);

  const { height } = useWindowDimensions();
  const {
    data: trip,
    isLoading,
    isRefetching,
  } = useTripByIdQuery(match.params.id, {
    refetchInterval: 10000,
  });
  const { mutate: update, isLoading: isUpdatingTrip } = useTripUpdateMutation();

  const isLoadingTrip = isLoading || isRefetching || isUpdatingTrip;
  const path = trip?.path;
  const students = trip?.students;
  const latitude = trip?.latitude;
  const longitude = trip?.longitude;
  const destination = trip?.itinerary?.school?.address;

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
    };

    addMarker();
  }, [latitude, longitude, isGoogleMapCreated]);

  useEffect(() => {
    const start = async () => {
      if (trip && !trip.startedAt) {
        update({
          ...trip,
          startedAt: new Date(),
        });
      }
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

    start();
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

    const addMarkers = async () => {
      if (!googleMapRef.current || !students) return;

      if (studentMarkersRef.current.length > 0) {
        await googleMapRef.current.removeMarkers(studentMarkersRef.current);
      }

      const markers = students
        .filter((student) => !student.pivot?.embarkedAt)
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
  }, [students, isGoogleMapCreated]);

  useEffect(() => {
    if (!isGoogleMapCreated) return;

    const addMarker = async () => {
      if (!googleMapRef.current || !destination) return;

      if (destinationMarkerRef.current) {
        await googleMapRef.current.removeMarker(destinationMarkerRef.current);
      }

      destinationMarkerRef.current = await googleMapRef.current.addMarker({
        coordinate: {
          lat: destination.latitude,
          lng: destination.longitude,
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

    if (!watchRef.current) return;

    await Geolocation.clearWatch({ id: watchRef.current });
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
          <IonTitle>App</IonTitle>
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
              {students?.map((student, index) => (
                <IonItemSliding
                  disabled={index > 0 || !!student?.pivot?.embarkedAt}
                  onIonDrag={(event) => {
                    if (event.detail.ratio < -2 && trip) {
                      const syncStudents = [...students];
                      const pivot = student.pivot
                        ? {
                            ...student.pivot,
                            embarkedAt: new Date(),
                          }
                        : undefined;

                      syncStudents[index] = {
                        ...student,
                        pivot,
                      };

                      update({
                        ...trip,
                        students: syncStudents,
                      });

                      event.target.close();
                    }
                  }}
                >
                  <IonItemOptions side="start">
                    <IonItemOption expandable>Embarcou</IonItemOption>
                  </IonItemOptions>
                  <IonItem>
                    {index === 0 && !student.pivot?.embarkedAt ? (
                      isLoadingTrip ? (
                        <IonSpinner slot="start" color="primary" />
                      ) : (
                        <IonIcon
                          icon={arrowForward}
                          color="primary"
                          slot="start"
                        />
                      )
                    ) : null}
                    <IonLabel>
                      <h2>
                        {student.firstName} {student.lastName}
                      </h2>
                      <p>{student.address.description}</p>
                    </IonLabel>
                    {!!student?.pivot?.embarkedAt ? (
                      <IonIcon
                        icon={checkmarkCircle}
                        color="primary"
                        slot="end"
                      />
                    ) : (
                      <IonChip slot="end" color="primary">
                        {student.pivot?.order}º
                      </IonChip>
                    )}
                  </IonItem>
                </IonItemSliding>
              ))}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Trip;
