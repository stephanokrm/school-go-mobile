import { RawItinerary, Itinerary } from "../types";
import { driverToRawDriver } from "./driverToRawDriver";
import { schoolToRawSchool } from "./schoolToRawSchool";
import { studentToRawStudent } from "./studentToRawStudent";
import { addressToRawAddress } from "./addressToRawAddress";

export const itineraryToRawItinerary = async (
  itinerary: Itinerary
): Promise<RawItinerary> => ({
  id: itinerary.id,
  morning: itinerary.morning,
  afternoon: itinerary.afternoon,
  night: itinerary.night,
  monday: itinerary.monday,
  tuesday: itinerary.tuesday,
  wednesday: itinerary.wednesday,
  thursday: itinerary.thursday,
  friday: itinerary.friday,
  address: await addressToRawAddress(itinerary.address),
  driver: await driverToRawDriver(itinerary.driver),
  school: await schoolToRawSchool(itinerary.school),
  students: Array.isArray(itinerary.students)
    ? await Promise.all(itinerary.students.map(studentToRawStudent))
    : undefined,
});
