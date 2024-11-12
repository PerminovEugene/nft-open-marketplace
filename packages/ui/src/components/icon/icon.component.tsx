"use client";

import React from "react";
import { FaCheck, FaLink, FaThumbtack } from "react-icons/fa";
import { FaTableList } from "react-icons/fa6";

export enum IconName {
  Thumbtack = "thumbtack",
  TableList = "table-list",
  Link = "link",
  Check = "check",
}

const iconsMap = {
  [IconName.Thumbtack]: <FaThumbtack />,
  [IconName.TableList]: <FaTableList />,
  [IconName.Link]: <FaLink />,
  [IconName.Check]: <FaCheck />,
};

const Icon = ({ iconName }: { iconName: IconName }) => {
  return iconsMap[iconName];
};

export default Icon;
