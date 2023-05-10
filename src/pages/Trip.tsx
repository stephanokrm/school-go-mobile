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
  const markerRef = useRef<string>();
  const zoomRef = useRef<number>(15);
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
        zoom: zoomRef.current,
      },
    });

    googleMapRef.current?.addPolylines([
      {
        path: [
          {
            lat: -29.910310000000003,
            lng: -51.166070000000005,
          },
          {
            lat: -29.910320000000002,
            lng: -51.165960000000005,
          },
          {
            lat: -29.910370000000004,
            lng: -51.16574000000001,
          },
          {
            lat: -29.910490000000003,
            lng: -51.16536000000001,
          },
          {
            lat: -29.91052,
            lng: -51.16532,
          },
          {
            lat: -29.91053,
            lng: -51.16527000000001,
          },
          {
            lat: -29.913680000000003,
            lng: -51.165670000000006,
          },
          {
            lat: -29.915010000000002,
            lng: -51.16586,
          },
          {
            lat: -29.91664,
            lng: -51.16606,
          },
          {
            lat: -29.91719,
            lng: -51.16613,
          },
          {
            lat: -29.917370000000002,
            lng: -51.1662,
          },
          {
            lat: -29.91738,
            lng: -51.16624,
          },
          {
            lat: -29.917410000000004,
            lng: -51.16630000000001,
          },
          {
            lat: -29.917460000000002,
            lng: -51.16635,
          },
          {
            lat: -29.91757,
            lng: -51.1664,
          },
          {
            lat: -29.91767,
            lng: -51.166360000000005,
          },
          {
            lat: -29.917710000000003,
            lng: -51.16633,
          },
          {
            lat: -29.917730000000002,
            lng: -51.16630000000001,
          },
          {
            lat: -29.917820000000003,
            lng: -51.16628000000001,
          },
          {
            lat: -29.9189,
            lng: -51.16637000000001,
          },
          {
            lat: -29.919900000000002,
            lng: -51.16646,
          },
          {
            lat: -29.920900000000003,
            lng: -51.16651,
          },
          {
            lat: -29.923450000000003,
            lng: -51.1668,
          },
          {
            lat: -29.924680000000002,
            lng: -51.166900000000005,
          },
          {
            lat: -29.92462,
            lng: -51.16725,
          },
          {
            lat: -29.924450000000004,
            lng: -51.16814,
          },
          {
            lat: -29.924280000000003,
            lng: -51.169000000000004,
          },
          {
            lat: -29.924170000000004,
            lng: -51.16953,
          },
          {
            lat: -29.924640000000004,
            lng: -51.16957000000001,
          },
          {
            lat: -29.92593,
            lng: -51.169650000000004,
          },
          {
            lat: -29.927030000000002,
            lng: -51.16971,
          },
          {
            lat: -29.92752,
            lng: -51.169720000000005,
          },
          {
            lat: -29.92751,
            lng: -51.17033000000001,
          },
          {
            lat: -29.928410000000003,
            lng: -51.17033000000001,
          },
          {
            lat: -29.930300000000003,
            lng: -51.170390000000005,
          },
          {
            lat: -29.931870000000004,
            lng: -51.170460000000006,
          },
          {
            lat: -29.932050000000004,
            lng: -51.17047,
          },
          {
            lat: -29.932440000000003,
            lng: -51.17049,
          },
          {
            lat: -29.932470000000002,
            lng: -51.171220000000005,
          },
          {
            lat: -29.93249,
            lng: -51.17168,
          },
          {
            lat: -29.932560000000002,
            lng: -51.17338,
          },
          {
            lat: -29.93268,
            lng: -51.17627,
          },
          {
            lat: -29.932730000000003,
            lng: -51.17734,
          },
          {
            lat: -29.932430000000004,
            lng: -51.17736000000001,
          },
          {
            lat: -29.932260000000003,
            lng: -51.17736000000001,
          },
          {
            lat: -29.93099,
            lng: -51.177420000000005,
          },
          {
            lat: -29.929180000000002,
            lng: -51.177510000000005,
          },
          {
            lat: -29.926450000000003,
            lng: -51.177620000000005,
          },
          {
            lat: -29.926250000000003,
            lng: -51.17759,
          },
          {
            lat: -29.926090000000002,
            lng: -51.177550000000004,
          },
          {
            lat: -29.92603,
            lng: -51.177240000000005,
          },
          {
            lat: -29.925950000000004,
            lng: -51.17696,
          },
          {
            lat: -29.925720000000002,
            lng: -51.17649,
          },
          {
            lat: -29.92537,
            lng: -51.176,
          },
          {
            lat: -29.9249,
            lng: -51.175360000000005,
          },
          {
            lat: -29.924310000000002,
            lng: -51.174510000000005,
          },
          {
            lat: -29.924110000000002,
            lng: -51.174310000000006,
          },
          {
            lat: -29.923910000000003,
            lng: -51.174170000000004,
          },
          {
            lat: -29.922850000000004,
            lng: -51.173480000000005,
          },
          {
            lat: -29.92256,
            lng: -51.173230000000004,
          },
          {
            lat: -29.92237,
            lng: -51.173,
          },
          {
            lat: -29.92227,
            lng: -51.172850000000004,
          },
          {
            lat: -29.922200000000004,
            lng: -51.17269,
          },
          {
            lat: -29.92142,
            lng: -51.170030000000004,
          },
          {
            lat: -29.920930000000002,
            lng: -51.168260000000004,
          },
          {
            lat: -29.920880000000004,
            lng: -51.16805,
          },
          {
            lat: -29.92086,
            lng: -51.16787000000001,
          },
          {
            lat: -29.92086,
            lng: -51.167840000000005,
          },
        ],
      },
    ]);

    googleMapRef.current?.setOnBoundsChangedListener(
      (event) => (zoomRef.current = event.zoom)
    );

    watchRef.current = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
      },
      (position) => {
        if (!googleMapRef.current || !position) return;

        googleMapRef.current?.setCamera({
          animate: true,
          zoom: zoomRef.current,
          coordinate: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });

        if (markerRef.current) {
          googleMapRef.current?.removeMarker(markerRef.current);
        }

        googleMapRef.current
          ?.addMarker({
            coordinate: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            iconUrl: "bus.png",
            iconSize: {
              width: zoomRef.current * 5,
              height: zoomRef.current * 5,
            },
          })
          .then((marker) => (markerRef.current = marker));
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
