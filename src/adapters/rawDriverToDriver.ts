import { RawDriver, Driver } from "../types";
import { rawUserToUser } from "./rawUserToUser";

export const rawDriverToDriver = async (
  rawDriver: RawDriver
): Promise<Driver> => ({
  id: rawDriver.id,
  license: rawDriver.license,
  user: await rawUserToUser(rawDriver.user),
});
