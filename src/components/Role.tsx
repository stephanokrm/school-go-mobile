import { FC, lazy } from "react";
import { RoleEnum } from "../enums/Role";

interface RoleProps {
  role: RoleEnum;
}

const Driver = lazy(() => import("./Driver"));
const Responsible = lazy(() => import("./Responsible"));

export const Role: FC<RoleProps> = ({ role }) => {
  switch (role) {
    case RoleEnum.Driver:
      return <Driver />;
    case RoleEnum.Responsible:
      return <Responsible />;
    default:
      return null;
  }
};
