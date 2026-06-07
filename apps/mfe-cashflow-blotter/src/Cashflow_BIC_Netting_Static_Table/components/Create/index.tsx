import { Button } from "antd";
import { useMemo } from "react";
import { getUserRole } from "src/Cashflow_BIC_Netting_Static_Table/state/permission";
import { useAppDispatch } from "src/Cashflow_BIC_Netting_Static_Table/store";
import { openCreateDialog } from "src/Cashflow_BIC_Netting_Static_Table/store/detail.slice";

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
