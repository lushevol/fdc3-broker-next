import { Stack } from "@mui/material";
import { Button } from "Import/index";
import React, { forwardRef } from "react";
import { get_MULTI_EXCEPTION_NOSTRO_FORM_ACTION } from "src/Root/analysis/const";
import { CustomForm } from "src/Root/import/ratancomponents";

import { NOSTRO_DETAILS_CONFIG_CN } from "../../../../../Main/config/fieldsConfig";
import {
  MultiExceptionsFormNames,
  RefStructType,
} from "../../common/interface";
import { editingActions } from "../../common/utils";
import { NostroFormProps } from "./interface";
import { classes } from "./style";

const form = forwardRef<RefStructType, NostroFormProps>(
  ({ data, disable, actions, onTriggerAction }, ref) => {
    return (
      <CustomForm
        className={classes.form}
        ref={ref}
        defaultData={data}
        editable={false}
        formName={MultiExceptionsFormNames.NostroForm}
        formConfig={NOSTRO_DETAILS_CONFIG_CN}
        validationRuleName="NOSTRO_VALIDATE_RULES"
        isCashflowSettlementCN
      >
        <Stack className={classes.operations} direction="row-reverse">
          {actions.map((a) => {
            if (!editingActions.includes(a) || disable) {
              return (
                <Button
                  variant="contained"
                  data-testid={get_MULTI_EXCEPTION_NOSTRO_FORM_ACTION(a)}
                  onClick={() => onTriggerAction(a)}
                  key={a}
                >
                  {a}
                </Button>
              );
            }
          })}
        </Stack>
      </CustomForm>
    );
  }
);

export default form;
