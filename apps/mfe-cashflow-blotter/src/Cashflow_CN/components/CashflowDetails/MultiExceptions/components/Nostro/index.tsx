import React, { forwardRef, useCallback, useContext } from "react";

import { RefStructType } from "../../common/interface";
import { editingActions, FIXING_MISSING_NOSTRO } from "../../common/utils";
import { LayoutAvailableActions } from "../../hooks/interface";
import { FixingMissingNostroContext } from "../../hooks/useController";
import { layoutSettingContext } from "../Layout/item";
import NostroForm from "./form";
import { NostroSectionProps } from "./interface";
import NostroList from "./list";
import StyledStack from "./style";

const NostroSection = forwardRef<RefStructType, NostroSectionProps>(
  ({ listData, detailsData, onSelectRecord }, ref) => {
    const layoutSetting = useContext(layoutSettingContext);
    const fixingMissingNostro = useContext(FixingMissingNostroContext);
    const handleTriggerAction = useCallback(
      (action: LayoutAvailableActions) => {
        if (editingActions.includes(action)) {
          layoutSetting.setDisable(false);
        }
        if (action === FIXING_MISSING_NOSTRO) {
          fixingMissingNostro.setIsFixingMissingNostro(true);
        }
      },
      []
    );
    return (
      <StyledStack>
        {!layoutSetting.disable && (
          <NostroList data={listData} onSelectRow={onSelectRecord} />
        )}
        <NostroForm
          data={detailsData}
          ref={ref}
          disable={layoutSetting.disable}
          actions={layoutSetting.availableActions ?? []}
          onTriggerAction={handleTriggerAction}
        />
      </StyledStack>
    );
  }
);

export default NostroSection;
