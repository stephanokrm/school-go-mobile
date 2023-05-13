// COMMON

import { AxiosError } from "axios";
import { RoleEnum } from "./enums/Role";

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
  fcm_token: string | null;
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
  latitude?: number;
  longitude?: number;
}

export type Address = {
  description: string;
  place: string;
  latitude: number;
  longitude: number;
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
  pivot: {
    order: number;
    embarked_at: string | null;
  } | null;
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
  pivot?: {
    order: number;
    embarkedAt?: Date;
  };
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

type Path = { lat: number; lng: number };

export type RawTrip = {
  id: number;
  path: Path[];
  arrive_at: string;
  latitude: number | null;
  longitude: number | null;
  started_at: string | null;
  finished_at: string | null;
  itinerary: RawItinerary;
  created_at: string;
  updated_at: string | null;
  students: RawStudent[] | null;
};

export type Trip = {
  id: number;
  path: Path[];
  arriveAt: Date;
  latitude?: number;
  longitude?: number;
  startedAt?: Date;
  finishedAt?: Date;
  itinerary: Itinerary;
  createdAt: Date;
  updatedAt?: Date;
  students?: Student[];
};
