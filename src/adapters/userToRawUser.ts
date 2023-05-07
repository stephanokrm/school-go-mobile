import { RawUser, User } from "../types";
import { parsePhoneNumber } from "libphonenumber-js";
import { roleToRawRole } from "./roleToRawRole";

export const userToRawUser = async (user: User): Promise<RawUser> => ({
  id: user.id,
  first_name: user.firstName,
  last_name: user.lastName,
  email: user.email,
  email_verified_at: user.emailVerifiedAt?.toISOString() ?? null,
  cell_phone: parsePhoneNumber(user.cellPhone, "BR").number,
  fcm_token: user.fcmToken,
  password: user.password,
  password_confirmation: user.passwordConfirmation ?? null,
  created_at: user.createdAt?.toISOString() ?? null,
  updated_at: user.updatedAt?.toISOString() ?? null,
  roles: Array.isArray(user.roles)
    ? await Promise.all(user.roles.map(roleToRawRole))
    : undefined,
});
