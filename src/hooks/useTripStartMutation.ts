import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCsrfQuery } from "./useCsrfQuery";
import { BackendError, RawTrip, Resource, Trip } from "../types";
import axios from "../lib/axios";

type Response = Resource<RawTrip>;

export const useTripStartMutation = () => {
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation<Response, BackendError, Trip>(
    ["TripStart"],
    async (trip) => {
      const { data } = await axios.post<Response>(
        `/api/trip/${trip.id}/start`,
        {
          _method: "PUT",
        }
      );

      await queryClient.invalidateQueries({ queryKey: ["Trips"] });
      await queryClient.invalidateQueries({ queryKey: ["TripById", trip.id] });

      return data;
    }
  );
};
