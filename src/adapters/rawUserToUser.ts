import { parseISO } from "date-fns";
import { RawUser, User } from "../types";
import { parsePhoneNumber } from "libphonenumber-js";
import { rawRoleToRole } from "./rawRoleToRole";

export const rawUserToUser = async (rawUser: RawUser): Promise<User> => ({
  id: rawUser.id,
  firstName: rawUser.first_name,
  lastName: rawUser.last_name,
  email: rawUser.email,
  emailVerifiedAt: rawUser.email_verified_at
    ? parseISO(rawUser.email_verified_at)
    : undefined,
  cellPhone: parsePhoneNumber(rawUser.cell_phone, "BR").formatNational(),
  fcmToken: rawUser.fcm_token,
  password: rawUser.password ?? undefined,
  passwordConfirmation: rawUser.password_confirmation ?? undefined,
  createdAt: rawUser.created_at ? parseISO(rawUser.created_at) : undefined,
  updatedAt: rawUser.updated_at ? parseISO(rawUser.updated_at) : undefined,
  roles: Array.isArray(rawUser.roles)
    ? await Promise.all(rawUser.roles.map(rawRoleToRole))
    : undefined,
});
