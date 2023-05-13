import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCsrfQuery } from "./useCsrfQuery";
import { BackendError, RawTrip, Resource, Trip } from "../types";
import axios from "../lib/axios";
import { tripToRawTrip } from "../adapters/tripToRawTrip";

type Response = Resource<RawTrip>;

export const useTripUpdateMutation = () => {
  const queryClient = useQueryClient();

  useCsrfQuery();

  return useMutation<Response, BackendError, Trip>(
    ["TripUpdate"],
    async (trip) => {
      const { data } = await axios.post<Response>(`/api/trip/${trip.id}`, {
        ...(await tripToRawTrip(trip)),
        _method: "PUT",
      });

      await queryClient.refetchQueries({ queryKey: ["TripById", trip.id] });

      return data;
    }
  );
};
