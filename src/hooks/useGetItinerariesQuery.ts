import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import { RawItinerary, Resource } from "../types";
import { rawItineraryToItinerary } from "../adapters/rawItineraryToItinerary";

interface Params {
  driver: boolean;
}

export const useGetItinerariesQuery = (params: Params) => {
  return useQuery(["getItineraries"], async ({ signal }) => {
    const {
      data: { data: rawItinerary },
    } = await axios.get<Resource<RawItinerary[]>>(`/api/itinerary`, {
      params,
      signal,
    });

    return Promise.all(rawItinerary.map(rawItineraryToItinerary));
  });
};
