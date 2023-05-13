import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import { RawTrip, Resource } from "../types";
import { rawTripToTrip } from "../adapters/rawTripToTrip";

interface Options {
  refetchInterval?: number;
}

export const useTripByIdQuery = (
  id: string,
  { refetchInterval }: Options = {}
) => {
  return useQuery(
    ["TripById", id],
    async ({ signal }) => {
      const {
        data: { data: rawTrip },
      } = await axios.get<Resource<RawTrip>>(`/api/trip/${id}`, {
        signal,
      });

      return rawTripToTrip(rawTrip);
    },
    {
      refetchInterval,
    }
  );
};
