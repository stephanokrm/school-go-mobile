import { RawResponsible, Responsible } from "../types";
import { rawUserToUser } from "./rawUserToUser";

export const rawResponsibleToResponsible = async (
  rawResponsible: RawResponsible
): Promise<Responsible> => ({
  id: rawResponsible.id,
  user: await rawUserToUser(rawResponsible.user),
});
