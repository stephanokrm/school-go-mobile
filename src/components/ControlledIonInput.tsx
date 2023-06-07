import { Controller, ControllerProps, FieldValues } from "react-hook-form";
import { IonInput } from "@ionic/react";
import { TextFieldTypes } from "@ionic/core";

type ControlledIonInputProps<FieldValue extends FieldValues> = Pick<
  ControllerProps<FieldValue>,
  "name" | "control"
> & {
  placeholder?: string;
  label?: string;
  type?: TextFieldTypes;
};

export function ControlledIonInput<FieldValue extends FieldValues>(
  props: ControlledIonInputProps<FieldValue>
) {
  const { control, label, name, placeholder, type } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <IonInput
          className={`${fieldState.invalid ? "ion-invalid" : "ion-valid"} ${
            fieldState.isTouched && "ion-touched"
          }`}
          errorText={fieldState.error?.message}
          label={label}
          labelPlacement="floating"
          onIonChange={field.onChange}
          placeholder={placeholder}
          type={type}
        />
      )}
    />
  );
}
