import { RawSchool, School } from "../types";
import { rawAddressToAddress } from "./rawAddressToAddress";
import { parse } from "date-fns";

export const rawSchoolToSchool = async (
  rawSchool: RawSchool
): Promise<School> => ({
  id: rawSchool.id,
  name: rawSchool.name,
  morning: rawSchool.morning,
  afternoon: rawSchool.afternoon,
  night: rawSchool.night,
  morningEntryTime: rawSchool.morning_entry_time
    ? parse(rawSchool.morning_entry_time, "HH:mm:ss", new Date())
    : undefined,
  morningDepartureTime: rawSchool.morning_departure_time
    ? parse(rawSchool.morning_departure_time, "HH:mm:ss", new Date())
    : undefined,
  afternoonEntryTime: rawSchool.afternoon_entry_time
    ? parse(rawSchool.afternoon_entry_time, "HH:mm:ss", new Date())
    : undefined,
  afternoonDepartureTime: rawSchool.afternoon_departure_time
    ? parse(rawSchool.afternoon_departure_time, "HH:mm:ss", new Date())
    : undefined,
  nightEntryTime: rawSchool.night_entry_time
    ? parse(rawSchool.night_entry_time, "HH:mm:ss", new Date())
    : undefined,
  nightDepartureTime: rawSchool.night_departure_time
    ? parse(rawSchool.night_departure_time, "HH:mm:ss", new Date())
    : undefined,
  address: await rawAddressToAddress(rawSchool.address),
});
