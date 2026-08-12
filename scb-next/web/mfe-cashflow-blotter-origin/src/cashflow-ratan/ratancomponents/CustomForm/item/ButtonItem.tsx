import React, { FC } from "react";
import Button from "@mui/material/Button";

export const ButtonItem: FC<any> = ({
  disabled,
  field,
  buttonText,
  onClick,
  configs,
  update,
  form,
}: any) => {
  const onClickFun = async () => {
    const newConfigs = await onClick(configs, form);
    if (Array.isArray(newConfigs)) {
      update(newConfigs);
    }
  };

  return (
    <Button
      className="query-btn"
      color="primary"
      disabled={disabled}
      data-testid={field}
      onClick={onClickFun}
    >
      {buttonText}
    </Button>
  );
};
