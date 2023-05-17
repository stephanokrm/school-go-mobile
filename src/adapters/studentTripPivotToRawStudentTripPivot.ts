import { RawStudentTripPivot, StudentTripPivot } from "../types";
import { zonedTimeToUtc } from "date-fns-tz";

export const studentTripPivotToRawStudentTripPivot = async (
  studentTripPivot: StudentTripPivot
): Promise<RawStudentTripPivot> => ({
  order: studentTripPivot.order,
  absent: studentTripPivot.absent,
  embarked_at: studentTripPivot.embarkedAt
    ? zonedTimeToUtc(
        studentTripPivot.embarkedAt,
        "America/Sao_Paulo"
      ).toISOString()
    : null,
  disembarked_at: studentTripPivot.disembarkedAt
    ? zonedTimeToUtc(
        studentTripPivot.disembarkedAt,
        "America/Sao_Paulo"
      ).toISOString()
    : null,
});
