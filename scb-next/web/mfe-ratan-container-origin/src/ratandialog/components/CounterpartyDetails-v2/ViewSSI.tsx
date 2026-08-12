import React, { FC } from "react";

import { CustomForm } from "../../../ratancomponents/CustomForm";
import { MuiDialog } from "../../../ratancomponents/Dialog/indexMuiV1";
import { SSI_DETAILS_CONFIG } from "../../../ratanutils/config/ratanexception/fieldsConfig";

import { RootStyle } from "./style";

interface ViewSSIProps {
  isOpen: boolean;
  onClose: Function;
  details: any;
}

export const ViewSSI: FC<ViewSSIProps> = ({ isOpen, onClose, details }) => {
  return (
    <RootStyle>
      <MuiDialog
        className="repair-dialog"
        title="Vostro Settlement Instruction"
        width={800}
        height={500}
        open={isOpen}
        onClose={onClose}
      >
        <CustomForm
          formConfig={SSI_DETAILS_CONFIG}
          defaultData={details}
          editable={false}
        />
      </MuiDialog>
    </RootStyle>
  );
};
