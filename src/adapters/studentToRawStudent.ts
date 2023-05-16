import { RawStudent, Student } from "../types";
import { addressToRawAddress } from "./addressToRawAddress";
import { responsibleToRawResponsible } from "./responsibleToRawResponsible";
import { schoolToRawSchool } from "./schoolToRawSchool";

export const studentToRawStudent = async (
  student: Student
): Promise<RawStudent> => ({
  id: student.id,
  first_name: student.firstName,
  last_name: student.lastName,
  morning: student.morning,
  afternoon: student.afternoon,
  night: student.night,
  goes: student.goes,
  return: student.return,
  address: await addressToRawAddress(student.address),
  responsible: await responsibleToRawResponsible(student.responsible),
  school: await schoolToRawSchool(student.school),
  trips: null,
  pivot: student.pivot
    ? {
        order: student.pivot.order,
        embarked_at: student.pivot.embarkedAt
          ? student.pivot.embarkedAt.toISOString()
          : null,
      }
    : null,
});
