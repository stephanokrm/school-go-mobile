import { RawAddress, Address } from "../types";

export const addressToRawAddress = async (
  address: Address
): Promise<RawAddress> => ({
  description: address.description,
  place_id: address.place,
});
