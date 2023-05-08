import { RawTrip, Trip } from "../types";
import { rawStudentToStudent } from "./rawStudentToStudent";
import { parseISO } from "date-fns";
import { rawItineraryToItinerary } from "./rawItineraryToItinerary";

export const rawTripToTrip = async (rawTrip: RawTrip): Promise<Trip> => ({
  id: rawTrip.id,
  arriveAt: parseISO(rawTrip.arrive_at),
  latitude: rawTrip.latitude ?? undefined,
  longitude: rawTrip.longitude ?? undefined,
  startedAt: rawTrip.started_at ? parseISO(rawTrip.started_at) : undefined,
  finishedAt: rawTrip.finished_at ? parseISO(rawTrip.finished_at) : undefined,
  itinerary: await rawItineraryToItinerary(rawTrip.itinerary),
  createdAt: parseISO(rawTrip.created_at),
  updatedAt: rawTrip.updated_at ? parseISO(rawTrip.updated_at) : undefined,
  students: Array.isArray(rawTrip.students)
    ? await Promise.all(rawTrip.students.map(rawStudentToStudent))
    : undefined,
});
