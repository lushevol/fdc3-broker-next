import { forwardRef, useCallback, useContext } from "react";

import { MultiExceptionsNames, RefStructType } from "../../common/interface";
import { ADHOC, editingActions } from "../../common/utils";
import { LayoutAvailableActions } from "../../hooks/interface";
import { AdhocingContext } from "../../hooks/useController";
import { layoutSettingContext } from "../Layout/item";
import VostroForm from "./form";
import { VostroSectionProps } from "./interface";
import VostroList from "./list";
import StyledStack from "./style";

const VostroSection = forwardRef<RefStructType, VostroSectionProps>(
  (
    {
      cashflowDetails,
      listData,
      detailsData,
      counterPartyDetails,
      onSelectRecord,
      onResetFormValidationStatus,
      setVostroFormFieldsValue,
      nostroDetailsData,
      isLookUpOnly,
    },
    ref
  ) => {
    const layoutSetting = useContext(layoutSettingContext);
    const adhocing = useContext(AdhocingContext);
    const handleTriggerAction = useCallback(
      (action: LayoutAvailableActions) => {
        if (editingActions.includes(action)) {
          layoutSetting.setDisable(false);
          onResetFormValidationStatus(MultiExceptionsNames.Vostro, detailsData);
        }
        if (action === ADHOC) {
          adhocing.setIsAdhocing(true);
        }
      },
      [detailsData]
    );
    return (
      <StyledStack>
        {!layoutSetting.disable && (
          <VostroList data={listData} onSelectRow={onSelectRecord} />
        )}
        <VostroForm
          data={detailsData}
          ref={ref}
          disable={isLookUpOnly ?? layoutSetting.disable}
          actions={layoutSetting.availableActions ?? []}
          onTriggerAction={handleTriggerAction}
          setVostroFormFieldsValue={setVostroFormFieldsValue}
          counterPartyDetails={counterPartyDetails}
          cashflowDetails={cashflowDetails}
          nostroDetailsData={nostroDetailsData}
        />
      </StyledStack>
    );
  }
);

export default VostroSection;
