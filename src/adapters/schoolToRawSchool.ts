import { format } from "date-fns";
import { RawSchool, School } from "../types";
import { addressToRawAddress } from "./addressToRawAddress";

export const schoolToRawSchool = async (
  school: School
): Promise<RawSchool> => ({
  id: school.id,
  name: school.name,
  morning: school.morning,
  afternoon: school.afternoon,
  night: school.night,
  morning_entry_time: school.morningEntryTime
    ? format(school.morningEntryTime, "HH:mm:ss")
    : undefined,
  morning_departure_time: school.morningDepartureTime
    ? format(school.morningDepartureTime, "HH:mm:ss")
    : undefined,
  afternoon_entry_time: school.afternoonEntryTime
    ? format(school.afternoonEntryTime, "HH:mm:ss")
    : undefined,
  afternoon_departure_time: school.afternoonDepartureTime
    ? format(school.afternoonDepartureTime, "HH:mm:ss")
    : undefined,
  night_entry_time: school.nightEntryTime
    ? format(school.nightEntryTime, "HH:mm:ss")
    : undefined,
  night_departure_time: school.nightDepartureTime
    ? format(school.nightDepartureTime, "HH:mm:ss")
    : undefined,
  address: await addressToRawAddress(school.address),
});
