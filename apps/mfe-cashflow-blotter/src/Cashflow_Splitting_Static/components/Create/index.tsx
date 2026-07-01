import { Button } from "Import/index";
import { useMemo } from "react";
import { getUserRole } from "src/Cashflow_Splitting_Static/state/permission";
import { useAppDispatch } from "src/Cashflow_Splitting_Static/store";
import { openCreateDialog } from "src/Cashflow_Splitting_Static/store/detail.slice";

export const CreateEntry = () => {
  const dispatch = useAppDispatch();

  const hasPermission = useMemo(() => getUserRole() !== "Visitor", []);

  return (
    <Button
      variant="outlined"
      disabled={!hasPermission}
      onClick={() => dispatch(openCreateDialog())}
      style={{ width: "80px" }}
      size="medium"
    >
      Create
    </Button>
  );
};
