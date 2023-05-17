import { parseISO } from "date-fns";
import { RawStudentTripPivot, StudentTripPivot } from "../types";

export const rawStudentTripPivotToStudentTripPivot = async (
  rawStudentTripPivot: RawStudentTripPivot
): Promise<StudentTripPivot> => ({
  order: rawStudentTripPivot.order,
  absent: rawStudentTripPivot.absent,
  embarkedAt: rawStudentTripPivot.embarked_at
    ? parseISO(rawStudentTripPivot.embarked_at)
    : undefined,
  disembarkedAt: rawStudentTripPivot.disembarked_at
    ? parseISO(rawStudentTripPivot.disembarked_at)
    : undefined,
});
