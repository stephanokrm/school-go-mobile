import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCsrfQuery } from "./useCsrfQuery";
import { BackendError, RawTrip, Resource, Student, Trip } from "../types";
import axios from "../lib/axios";

type Response = Resource<RawTrip>;
type Data = {
  trip: Trip;
  student: Student;
};

export const useTripStudentEmbarkMutation = () => {
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation<Response, BackendError, Data>(
    ["TripStudentEmbark"],
    async ({ trip, student }) => {
      const { data } = await axios.post<Response>(
        `/api/trip/${trip.id}/student/${student.id}/embark`,
        {
          embarked_at: new Date(),
          _method: "PUT",
        }
      );

      await queryClient.refetchQueries({ queryKey: ["TripById", trip.id] });

      return data;
    }
  );
};
