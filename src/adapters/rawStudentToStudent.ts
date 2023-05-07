import { RawStudent, Student } from "../types";
import { rawAddressToAddress } from "./rawAddressToAddress";
import { rawResponsibleToResponsible } from "./rawResponsibleToResponsible";
import { rawSchoolToSchool } from "./rawSchoolToSchool";

export const rawStudentToStudent = async (
  rawStudent: RawStudent
): Promise<Student> => ({
  id: rawStudent.id,
  firstName: rawStudent.first_name,
  lastName: rawStudent.last_name,
  morning: rawStudent.morning,
  afternoon: rawStudent.afternoon,
  night: rawStudent.night,
  goes: rawStudent.goes,
  return: rawStudent.return,
  address: await rawAddressToAddress(rawStudent.address),
  responsible: await rawResponsibleToResponsible(rawStudent.responsible),
  school: await rawSchoolToSchool(rawStudent.school),
});
