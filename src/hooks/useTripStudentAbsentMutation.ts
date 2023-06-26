import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCsrfQuery } from "./useCsrfQuery";
import { BackendError, RawTrip, Resource, Student, Trip } from "../types";
import axios from "../lib/axios";

type Response = Resource<RawTrip>;
type Data = {
  trip: Trip;
  student: Student;
};

export const useTripStudentAbsentMutation = () => {
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation<Response, BackendError, Data>(
    ["TripStudentAbsent"],
    async ({ trip, student }) => {
      const { data } = await axios.post<Response>(
        `/api/trip/${trip.id}/student/${student.id}/absent`,
        {
          _method: "PUT",
        }
      );

      await queryClient.invalidateQueries({ queryKey: ["Students"] });
      await queryClient.invalidateQueries({ queryKey: ["Trips"] });
      await queryClient.invalidateQueries({ queryKey: ["TripById", trip.id] });

      return data;
    }
  );
};
