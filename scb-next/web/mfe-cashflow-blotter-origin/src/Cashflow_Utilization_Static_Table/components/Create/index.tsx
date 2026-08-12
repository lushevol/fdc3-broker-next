import { Button } from "antd";
import { useMemo } from "react";

import { getUserRole } from "../../state/permission";
import { useAppDispatch } from "../../store";
import { openCreateDialog } from "../../store/detail.slice";

export const CreateEntry = () => {
  const dispatch = useAppDispatch();

  const hasPermission = useMemo(() => getUserRole() !== "Visitor", []);

  return (
    <Button
      type="primary"
      disabled={!hasPermission}
      onClick={() => dispatch(openCreateDialog())}
    >
      Create
    </Button>
  );
};
