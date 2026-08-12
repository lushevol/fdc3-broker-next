import React, { FC, memo, PropsWithChildren } from "react";
import { PopoverDetails } from "./PopoverDetails";
import { Popover } from "antd";
import InfoIcon from "@mui/icons-material/Info";
import { Root, PublicPopIconBtn, classes } from "./style";

interface PublicPopoverProps {
  value: string;
  name?: string;
  fieldsList?: {
    name: string;
    title?: string;
    fields: { label: string; field: string | number; handle?: Function }[];
  }[];
  details?: any;
  testId?: string;
  popoverEnable?: boolean;
  forceEnable?: boolean;
  reverse?: boolean;
}

export const PublicPopover: FC<PropsWithChildren<PublicPopoverProps>> = memo(
  ({
    value,
    name,
    fieldsList,
    details,
    children,
    testId,
    popoverEnable = true,
    forceEnable = false,
    reverse = false,
  }) => {
    const content = (
      <PopoverDetails
        fieldsList={fieldsList}
        details={details}
        children={children}
      />
    );

    return value || forceEnable ? (
      <Root>
        <div className="popover" data-testid={testId}>
          {name && <div className="popover-name">{name}</div>}
          <div className="popover-title" title={value}>
            {reverse && <div className="title-value">{value}</div>}
            {popoverEnable && (
              <Popover content={content} trigger="click">
                <PublicPopIconBtn
                  className={classes.popoverBtn}
                  data-testid="popover-btn"
                >
                  <InfoIcon sx={{ fontSize: 14 }} />
                </PublicPopIconBtn>
              </Popover>
            )}
            {!reverse && <div className="title-value">{value}</div>}
          </div>
        </div>
      </Root>
    ) : (
      <>---</>
    );
  }
);
