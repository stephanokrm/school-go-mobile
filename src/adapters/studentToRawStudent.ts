import { RawStudent, Student } from "../types";
import { addressToRawAddress } from "./addressToRawAddress";
import { responsibleToRawResponsible } from "./responsibleToRawResponsible";
import { schoolToRawSchool } from "./schoolToRawSchool";
import { studentTripPivotToRawStudentTripPivot } from "./studentTripPivotToRawStudentTripPivot";

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
    ? await studentTripPivotToRawStudentTripPivot(student.pivot)
    : null,
});
