import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import useDispatcher from "../../Root/hooks/dispatcher";
import { useContext } from "../../Root/hooks/provider";
import { ReactRouterDom } from "../../Root/import";

const RefreshBlotterBtn = () => {
  const { useNavigate, useResolvedPath } = ReactRouterDom;
  const { pathname } = useResolvedPath();
  const navi = useNavigate();
  const { dispatchRefreshState } = useDispatcher();
  const [store] = useContext();

  const click = () => {
    const pathArr = pathname.split("/").slice(0, 2);
    navi(pathArr.join("/"));
    const refreshState = store.refreshState || 0;
    dispatchRefreshState(refreshState + 1);
  };

  return (
    <Button
      className="button"
      variant="outlined"
      size="small"
      onClick={click}
      startIcon={<RefreshIcon style={{ fontSize: "14px" }} />}
    >
      Refresh Page
    </Button>
  );
};
export default RefreshBlotterBtn;
