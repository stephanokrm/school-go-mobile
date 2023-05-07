import { FC } from "react";
import { RoleEnum } from "../enums/Role";
import { Driver } from "./Driver";
import { Responsible } from "./Responsible";

interface RoleProps {
  role: RoleEnum;
}

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
