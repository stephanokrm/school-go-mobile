import { useQuery } from "@tanstack/react-query";
import { RawStudent, Resource } from "../types";
import { rawStudentToStudent } from "../adapters/rawStudentToStudent";
import axios from "../lib/axios";

export const useStudentByIdQuery = (id: string) => {
  return useQuery(["StudentById", id], async ({ signal }) => {
    const {
      data: { data: rawStudent },
    } = await axios.get<Resource<RawStudent>>(`/api/student/${id}`, { signal });

    return rawStudentToStudent(rawStudent);
  });
};
