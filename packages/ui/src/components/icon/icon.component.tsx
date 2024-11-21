"use client";

import React from "react";
import { FaCheck, FaLink, FaThumbtack, FaUserSecret } from "react-icons/fa";
import { FaTableList } from "react-icons/fa6";

export enum IconName {
  Thumbtack = "thumbtack",
  TableList = "table-list",
  Link = "link",
  Check = "check",
  Approve = "user-secret",
}

const iconsMap = {
  [IconName.Thumbtack]: <FaThumbtack />,
  [IconName.TableList]: <FaTableList />,
  [IconName.Link]: <FaLink />,
  [IconName.Check]: <FaCheck />,
  [IconName.Approve]: <FaUserSecret />,
};

const Icon = ({ iconName }: { iconName: IconName }) => {
  return iconsMap[iconName];
};

export default Icon;
