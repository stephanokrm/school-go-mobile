import { RawAddress, Address } from "../types";

export const rawAddressToAddress = async (
  address: RawAddress
): Promise<Address> => ({
  description: address.description,
  place: address.place_id,
});
