import { RawRole, Role } from "../types";

export const roleToRawRole = async (role: Role): Promise<RawRole> => ({
  id: role.id,
  role: role.role,
});
