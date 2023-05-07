import { RawRole, Role } from "../types";
import { RoleEnum } from "../enums/Role";

export const rawRoleToRole = async (rawRole: RawRole): Promise<Role> => ({
  id: rawRole.id,
  role: rawRole.role as RoleEnum,
});
