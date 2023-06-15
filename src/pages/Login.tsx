import * as yup from "yup";
import React, { FC, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonImg,
  IonItem,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  useIonToast,
} from "@ionic/react";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { useOnError } from "../hooks/useOnError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ControlledIonInput } from "../components/ControlledIonInput";

const loginSchema = yup
  .object({
    email: yup.string().email().required("O campo e-mail é obrigatório."),
    password: yup.string().required("O campo senha é obrigatório."),
  })
  .required();

export type LoginForm = yup.InferType<typeof loginSchema>;

export const Login: FC = () => {
  const [present] = useIonToast();
  const { mutate, error, isLoading } = useLoginMutation();
  const { onError } = useOnError();
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = handleSubmit((login) => mutate(login));

  useEffect(() => {
    if (error) {
      present({
        message: onError(error),
        duration: 5000,
        position: "bottom",
      });
    }
  }, [error]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonText className="ion-text-center">
          <h1>SchoolGo</h1>
        </IonText>
        <div
          className="ion-padding-vertical"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <IonImg src="logo.png" alt="Logo" />
        </div>
        <form onSubmit={onSubmit}>
          <IonList lines="none">
            <IonItem>
              <ControlledIonInput
                control={control}
                label="E-mail"
                name="email"
                placeholder="Digite seu e-mail"
                type="email"
              />
            </IonItem>
            <IonItem>
              <ControlledIonInput
                control={control}
                label="Senha"
                name="password"
                placeholder="Digite sua senha"
                type="password"
              />
            </IonItem>
            <div className="ion-padding">
              <IonButton expand="block" type="submit">
                {isLoading ? <IonSpinner name="dots" /> : "Entrar"}
              </IonButton>
            </div>
          </IonList>
        </form>
      </IonContent>
    </IonPage>
  );
};
