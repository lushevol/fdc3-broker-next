import { useRef } from "react";

import { ExtraFormRef } from "./../type";

export const useExtraForm = () => {
  const extraFormRef = useRef<ExtraFormRef>(null);

  const submitExtraForm = () => {
    const extraFormData = extraFormRef.current?.submit();
    return extraFormData;
  };

  return {
    extraFormRef,
    submitExtraForm,
  };
};
