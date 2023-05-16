import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import { RawTrip, Resource } from "../types";
import { rawTripToTrip } from "../adapters/rawTripToTrip";

interface Params {
  driver: boolean;
}

export const useGetTripsQuery = (params: Params) => {
  return useQuery(["Trips"], async ({ signal }) => {
    const {
      data: { data: rawTrip },
    } = await axios.get<Resource<RawTrip[]>>(`/api/trip`, {
      params,
      signal,
    });

    return Promise.all(rawTrip.map(rawTripToTrip));
  });
};
