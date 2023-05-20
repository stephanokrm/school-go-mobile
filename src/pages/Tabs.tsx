import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import Home from "./Home";
import Account from "./Account";
import { home, person } from "ionicons/icons";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

export const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/tabs" to="/tabs/home" />
        <Route exact path="/tabs/home" component={Home} />
        <Route exact path="/tabs/account" component={Account} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home" onClick={hapticsImpactLight}>
          <IonIcon aria-hidden icon={home} />
          <IonLabel>Página inicial</IonLabel>
        </IonTabButton>
        <IonTabButton
          tab="account"
          href="/tabs/account"
          onClick={hapticsImpactLight}
        >
          <IonIcon aria-hidden icon={person} />
          <IonLabel>Conta</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};
