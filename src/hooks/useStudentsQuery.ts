import { useQuery } from "@tanstack/react-query";
import { RawStudent, Resource } from "../types";
import axios from "../lib/axios";
import { rawStudentToStudent } from "../adapters/rawStudentToStudent";

interface Params {
  responsible?: boolean;
}

export const useStudentsQuery = (params: Params = {}) => {
  return useQuery(
    ["Students", params],
    async ({ signal }) => {
      const {
        data: { data: rawStudents },
      } = await axios.get<Resource<RawStudent[]>>(`/api/student`, {
        signal,
        params,
      });

      return Promise.all(rawStudents.map(rawStudentToStudent));
    },
    {
      refetchInterval: 30000,
    }
  );
};
