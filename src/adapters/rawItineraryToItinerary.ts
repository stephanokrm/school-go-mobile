import { RawItinerary, Itinerary } from "../types";
import { rawDriverToDriver } from "./rawDriverToDriver";
import { rawSchoolToSchool } from "./rawSchoolToSchool";
import { rawStudentToStudent } from "./rawStudentToStudent";
import { rawAddressToAddress } from "./rawAddressToAddress";

export const rawItineraryToItinerary = async (
  rawItinerary: RawItinerary
): Promise<Itinerary> => ({
  id: rawItinerary.id,
  morning: rawItinerary.morning,
  afternoon: rawItinerary.afternoon,
  night: rawItinerary.night,
  monday: rawItinerary.monday,
  tuesday: rawItinerary.tuesday,
  wednesday: rawItinerary.wednesday,
  thursday: rawItinerary.thursday,
  friday: rawItinerary.friday,
  address: await rawAddressToAddress(rawItinerary.address),
  driver: await rawDriverToDriver(rawItinerary.driver),
  school: await rawSchoolToSchool(rawItinerary.school),
  students: Array.isArray(rawItinerary.students)
    ? await Promise.all(rawItinerary.students.map(rawStudentToStudent))
    : undefined,
});
