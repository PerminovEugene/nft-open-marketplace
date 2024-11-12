import React from "react";

const Detail = ({ label, text }: { label: string; text: string }) => {
  return (
    <div className="flex justify-between">
      <span className="font-medium text-gray-600 dark:text-gray-400 pr-1">
        {label}
      </span>
      <span className="text-gray-800 dark:text-gray-200 break-all">{text}</span>
    </div>
  );
};
export default Detail;
