import { RawResponsible, Responsible } from "../types";
import { userToRawUser } from "./userToRawUser";

export const responsibleToRawResponsible = async (
  responsible: Responsible
): Promise<RawResponsible> => ({
  id: responsible.id,
  user: await userToRawUser(responsible.user),
});
