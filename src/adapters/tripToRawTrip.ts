import { zonedTimeToUtc } from "date-fns-tz";
import { RawTrip, Trip } from "../types";
import { itineraryToRawItinerary } from "./itineraryToRawItinerary";
import { studentToRawStudent } from "./studentToRawStudent";
import { studentTripPivotToRawStudentTripPivot } from "./studentTripPivotToRawStudentTripPivot";

export const tripToRawTrip = async (trip: Trip): Promise<RawTrip> => ({
  id: trip.id,
  path: trip.path,
  round: trip.round,
  arrive_at: zonedTimeToUtc(trip.arriveAt, "America/Sao_Paulo").toISOString(),
  latitude: trip.latitude ?? null,
  longitude: trip.longitude ?? null,
  started_at: trip.startedAt
    ? zonedTimeToUtc(trip.startedAt, "America/Sao_Paulo").toISOString()
    : null,
  finished_at: trip.finishedAt
    ? zonedTimeToUtc(trip.finishedAt, "America/Sao_Paulo").toISOString()
    : null,
  itinerary: await itineraryToRawItinerary(trip.itinerary),
  created_at: trip.createdAt.toISOString(),
  updated_at: trip.updatedAt ? trip.updatedAt.toISOString() : null,
  students: Array.isArray(trip.students)
    ? await Promise.all(trip.students.map(studentToRawStudent))
    : null,
  pivot: trip.pivot
    ? await studentTripPivotToRawStudentTripPivot(trip.pivot)
    : null,
});
