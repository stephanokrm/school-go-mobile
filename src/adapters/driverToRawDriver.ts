import { RawDriver, Driver } from "../types";
import { userToRawUser } from "./userToRawUser";

export const driverToRawDriver = async (
  driver: Driver
): Promise<RawDriver> => ({
  id: driver.id,
  license: driver.license,
  user: await userToRawUser(driver.user),
});
