import { RawTrip, Trip } from "../types";
import { rawStudentToStudent } from "./rawStudentToStudent";
import { parseISO } from "date-fns";
import { rawItineraryToItinerary } from "./rawItineraryToItinerary";
import { rawStudentTripPivotToStudentTripPivot } from "./rawStudentTripPivotToStudentTripPivot";
import { utcToZonedTime } from "date-fns-tz";

export const rawTripToTrip = async (rawTrip: RawTrip): Promise<Trip> => ({
  id: rawTrip.id,
  path: rawTrip.path,
  round: rawTrip.round,
  arriveAt: parseISO(rawTrip.arrive_at),
  latitude: rawTrip.latitude ?? undefined,
  longitude: rawTrip.longitude ?? undefined,
  startedAt: rawTrip.started_at
    ? utcToZonedTime(parseISO(rawTrip.started_at), "America/Sao_Paulo")
    : undefined,
  finishedAt: rawTrip.finished_at
    ? utcToZonedTime(parseISO(rawTrip.finished_at), "America/Sao_Paulo")
    : undefined,
  itinerary: await rawItineraryToItinerary(rawTrip.itinerary),
  createdAt: utcToZonedTime(parseISO(rawTrip.created_at), "America/Sao_Paulo"),
  updatedAt: rawTrip.updated_at
    ? utcToZonedTime(parseISO(rawTrip.updated_at), "America/Sao_Paulo")
    : undefined,
  students: Array.isArray(rawTrip.students)
    ? await Promise.all(rawTrip.students.map(rawStudentToStudent))
    : undefined,
  pivot: rawTrip.pivot
    ? await rawStudentTripPivotToStudentTripPivot(rawTrip.pivot)
    : undefined,
});
