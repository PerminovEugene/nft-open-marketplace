import React from "react";
import classNames from "classnames";

type SubmitButtonProps = {
  disabled: boolean;
  text: string;
};

const SubmitButton = ({ disabled, text }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={disabled}
    className={classNames("px-6 py-2 bg-blue-600 rounded text-lg", {
      "hover:bg-blue-500": disabled,
      "bg-blue-300 cursor-not-allowed": disabled,
    })}
  >
    {text}
  </button>
);

export default SubmitButton;
