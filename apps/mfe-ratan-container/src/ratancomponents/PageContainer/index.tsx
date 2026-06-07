import { Version } from "../Version";
import StyledPageContainer, { classes } from "./common/StyledPageContainer";
import Status from "../Status";
import RefreshBlotterBtn from "../RefreshBlotterBtn";
import { Loading } from "../Loading";
import { useContext } from "../../Root/hooks/provider";
import { useEffect, useState } from "react";
const PageContainer = ({ children }) => {
  const [store] = useContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (store.refreshState != 0) {
      setIsLoading(true);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [store.refreshState]);
  return (
    <StyledPageContainer>
      <div className={classes.header}>
        <div>
          <Version />
        </div>
        <div className={classes.headerItem}>
          <Status />
          <RefreshBlotterBtn />
        </div>
      </div>
      <div className={classes.page}>
        {isLoading ? (
          <Loading loading={true} size={70} text="loading..." />
        ) : (
          children
        )}
      </div>
    </StyledPageContainer>
  );
};
export default PageContainer;
