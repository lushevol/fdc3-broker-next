import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  css,
  styled,
  Typography,
} from "@mui/material";
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ContainerProvider } from "src/Root/import";

import { LayoutAvailableActions } from "../../hooks/interface";
import { LayoutItem } from "./interface";
import { classes, SPACE } from "./style";

export const Container = styled(Accordion)(({ theme }) => {
  return css`
    min-width: 100px;
    background-color: ${theme.palette.mode === "dark" ? "#1A2027" : "#F7F9FD"};
    &.Mui-expanded {
      margin: ${SPACE} 0;
    }
    .accordion-title {
      &.Mui-expanded {
        min-height: 48px;
      }
      .MuiAccordionSummary-content {
        margin: ${SPACE} 0;
        &.Mui-expanded {
          margin: ${SPACE} 0;
        }
      }
      & + .MuiCollapse-root {
        .accordion-body {
          padding-top: 0;
        }
      }
    }
    .accordion-body {
      padding-bottom: 16px;
      .ant-form-item {
        margin-bottom: 6px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  `;
});

export const layoutSettingContext = createContext<{
  disable: boolean;
  availableActions?: LayoutAvailableActions[];
  setDisable: Dispatch<SetStateAction<boolean>>;
  title?: string;
}>({
  disable: false,
  availableActions: [],
  setDisable: () => {
    // empty
  },
  title: "",
});

const Item: FC<PropsWithChildren<LayoutItem>> = ({
  title,
  children,
  sx,
  show = true,
  disable = false,
  availableActions,
  titleColor,
}) => {
  const [scopeTitle, setScopeTitle] = useState(title);
  const [scopeDisable, setScopeDisable] = useState(disable);
  const [ContainerStore] = ContainerProvider.useContext();
  useEffect(() => {
    setScopeTitle(title);
  }, [title]);
  useEffect(() => {
    setScopeDisable(disable);
  }, [disable]);
  const scopeLayoutSetting = useMemo(() => {
    return {
      disable: scopeDisable,
      setDisable: setScopeDisable,
      availableActions: availableActions,
      title: scopeTitle,
    };
  }, [scopeDisable, availableActions]);
  const computedTitleColor = useMemo(() => {
    if (titleColor) {
      return `${titleColor}.${ContainerStore.theme}`;
    }
    return undefined;
  }, [titleColor, ContainerStore.theme]);
  return (
    <>
      {show && (
        <layoutSettingContext.Provider value={scopeLayoutSetting}>
          <Container className={classes.item} sx={sx} expanded>
            {scopeTitle && (
              <AccordionSummary className="accordion-title" expandIcon={<></>}>
                <Typography color={computedTitleColor}>{scopeTitle}</Typography>
              </AccordionSummary>
            )}
            <AccordionDetails className="accordion-body">
              {children}
            </AccordionDetails>
          </Container>
        </layoutSettingContext.Provider>
      )}
    </>
  );
};

export default Item;
