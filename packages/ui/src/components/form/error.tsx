import react from "react";
import { FieldError } from "react-hook-form";

export const ErrorBlock = ({ error }: { error?: FieldError }) =>
  error && (
    <div className="mt-2 p-2 border border-red-500 bg-red-100 text-red-700 rounded">
      {error.message}
    </div>
  );
