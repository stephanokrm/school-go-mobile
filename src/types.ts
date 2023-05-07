// COMMON

import * as yup from "yup";
import { AxiosError } from "axios";
import { RoleEnum } from "./enums/Role";
// import {
//   driverCreateSchema,
//   driverEditSchema,
//   itineraryCreateSchema,
//   itineraryEditSchema,
//   loginSchema,
//   passwordResetFormSchema,
//   responsibleCreateSchema,
//   responsibleEditSchema,
//   schoolCreateSchema,
//   schoolEditSchema,
//   studentCreateSchema,
//   studentEditSchema,
//   userCreateSchema,
//   userEditSchema,
// } from "./schemas";

export type Resource<T> = {
  data: T;
};

export type BackendError = AxiosError<{ message?: string }>;

// MODELS

export type RawRole = {
  id: number;
  role: string;
};

export type Role = {
  id: number;
  role: RoleEnum;
};

export type RawUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  cell_phone: string;
  fcm_token?: string;
  password: string;
  password_confirmation: string | null;
  created_at: string | null;
  updated_at: string | null;
  roles?: RawRole[];
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt?: Date;
  cellPhone: string;
  fcmToken?: string;
  password: string;
  passwordConfirmation?: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: Role[];
};

export type RawDriver = {
  id: number;
  license: string;
  user: RawUser;
};

export type Driver = {
  id: number;
  license: string;
  user: User;
};

export type RawResponsible = {
  id: number;
  user: RawUser;
};

export type Responsible = {
  id: number;
  user: User;
};

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}

interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}

export interface RawAddress {
  description: string;
  place_id: string;
  structured_formatting?: StructuredFormatting;
}

export type Address = {
  description: string;
  place: string;
};

export type RawSchool = {
  id: number;
  name: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  morning_entry_time?: string;
  morning_departure_time?: string;
  afternoon_entry_time?: string;
  afternoon_departure_time?: string;
  night_entry_time?: string;
  night_departure_time?: string;
  address: RawAddress;
};

export type School = {
  id: number;
  name: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  morningEntryTime?: Date;
  morningDepartureTime?: Date;
  afternoonEntryTime?: Date;
  afternoonDepartureTime?: Date;
  nightEntryTime?: Date;
  nightDepartureTime?: Date;
  address: Address;
};

export type RawStudent = {
  id: number;
  first_name: string;
  last_name: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  goes: boolean;
  return: boolean;
  address: RawAddress;
  responsible: RawResponsible;
  school: RawSchool;
};

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  goes: boolean;
  return: boolean;
  address: Address;
  responsible: Responsible;
  school: School;
};

export type RawItinerary = {
  id: number;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  driver: RawDriver;
  school: RawSchool;
  students?: RawStudent[];
};

export type Itinerary = {
  id: number;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  driver: Driver;
  school: School;
  students?: Student[];
};

// FIELD VALUES

// export type LoginForm = yup.InferType<typeof loginSchema>;
// export type PasswordResetForm = yup.InferType<typeof passwordResetFormSchema>;
//
// export type ItineraryCreateForm = yup.InferType<typeof itineraryCreateSchema>;
// export type ItineraryEditForm = yup.InferType<typeof itineraryEditSchema>;
//
// export type DriverCreateForm = yup.InferType<typeof driverCreateSchema>;
// export type DriverEditForm = yup.InferType<typeof driverEditSchema>;
//
// export type ResponsibleCreateForm = yup.InferType<
//   typeof responsibleCreateSchema
// >;
// export type ResponsibleEditForm = yup.InferType<typeof responsibleEditSchema>;
//
// export type SchoolCreateForm = yup.InferType<typeof schoolCreateSchema>;
// export type SchoolEditForm = yup.InferType<typeof schoolEditSchema>;
//
// export type StudentCreateForm = yup.InferType<typeof studentCreateSchema>;
// export type StudentEditForm = yup.InferType<typeof studentEditSchema>;
//
// export type UserCreateForm = yup.InferType<typeof userCreateSchema>;
// export type UserEditForm = yup.InferType<typeof userEditSchema>;
