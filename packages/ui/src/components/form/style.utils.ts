export const getInputDisabledStyles = (disabled?: boolean) => {
  return {
    "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:border-gray-500":
      !disabled,
    "opacity-50 cursor-not-allowed": disabled,
  };
};

export const inputStyles =
  'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"';
