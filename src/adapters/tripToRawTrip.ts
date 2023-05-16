import { RawTrip, Trip } from "../types";
import { itineraryToRawItinerary } from "./itineraryToRawItinerary";
import { studentToRawStudent } from "./studentToRawStudent";

export const tripToRawTrip = async (trip: Trip): Promise<RawTrip> => ({
  id: trip.id,
  path: trip.path,
  round: trip.round,
  arrive_at: trip.arriveAt.toISOString(),
  latitude: trip.latitude ?? null,
  longitude: trip.longitude ?? null,
  started_at: trip.startedAt ? trip.startedAt.toISOString() : null,
  finished_at: trip.finishedAt ? trip.finishedAt.toISOString() : null,
  itinerary: await itineraryToRawItinerary(trip.itinerary),
  created_at: trip.createdAt.toISOString(),
  updated_at: trip.updatedAt ? trip.updatedAt.toISOString() : null,
  students: Array.isArray(trip.students)
    ? await Promise.all(trip.students.map(studentToRawStudent))
    : null,
});
