import React, { FC, useEffect, memo, useState } from "react";
import { flatten } from "flat";
import _get from "lodash/get";

import { deepClone, isEmpty } from "../../../ratanutils/utils";
import { queryCounterPartyDetails } from "../../../ratanutils/http/graphql";
import { RootStyle } from "./style";
import { DetailsLoading } from "./DetailsDom";
/* Disabled View SSI
 * import { SsiLists } from "../SsiTableDialog/SsiLists";
 * import { ViewSSI } from "./ViewSSI";
 */

interface RegulatoryInfoItem {
  regulatoryTypeValue: string;
  regulatoryFields: string;
  regulatoryField2Value: string;
  regulatoryFieldText: string;
}

export function extractFromRegulatoryInfo(
  regulatoryinfo: Array<RegulatoryInfoItem>
) {
  const res = {
    lei: "",
    emirAssignment: "",
    emirClassification: "",
    emirClearing: "",
    hkClearing: "",
    masClassification: "",
  };

  for (let item of regulatoryinfo) {
    if (
      item.regulatoryTypeValue === "MIFID" &&
      item.regulatoryFields === "LEI"
    ) {
      res.lei = item.regulatoryFieldText;
    } else if (
      item.regulatoryTypeValue === "EMIR" &&
      item.regulatoryFields === "ASSIGNFLAG"
    ) {
      res.emirAssignment = item.regulatoryField2Value;
    } else if (
      item.regulatoryTypeValue === "EMIR" &&
      item.regulatoryFields === "CLASSFICAT"
    ) {
      res.emirClassification = item.regulatoryField2Value;
    } else if (
      item.regulatoryTypeValue === "EMIR" &&
      item.regulatoryFields === "EMIRCLRCAT"
    ) {
      res.emirClearing = item.regulatoryField2Value;
    } else if (
      item.regulatoryTypeValue === "HKMA" &&
      item.regulatoryFields === "HKCLRCLS"
    ) {
      res.hkClearing = item.regulatoryField2Value;
    } else if (
      item.regulatoryTypeValue === "MAS" &&
      item.regulatoryFields === "MASCL"
    ) {
      res.masClassification = item.regulatoryField2Value;
    }
  }
  return res;
}

export function isGSAMClient(creditGradeCodeValueList: Array<any>) {
  const avalidValues = ["12A", "12B", "12C", "13", "14"];
  return creditGradeCodeValueList.some((i) =>
    avalidValues.includes(i.creditGradeCodeValue)
  );
}

// to do, need remove, we already ask SCI team to change the data format.
export function washData(data: any) {
  if (!data.fmEntity) {
    return data;
  }
  const newDetails = deepClone(data);
  newDetails.fmEntity.legalEntity.legalEntityOrgDetails =
    _get(
      newDetails,
      "newDetails.fmEntity.legalEntity.legalEntityOrgDetails[0]"
    ) || {};
  newDetails.fmEntity.legalEntity.legalEntityOrgDetails.clientTax = _get(
    newDetails,
    "newDetails.fmEntity.legalEntity.legalEntityOrgDetails.clientTax[0]"
  );
  newDetails.fmEntity.legalEntity.legalEntityOrgDetails.officialAddress = _get(
    newDetails,
    "newDetails.fmEntity.legalEntity.legalEntityOrgDetails.officialAddress[0]"
  );
  newDetails.fmEntity.legalEntity.legalEntityOrgDetails.empRelationship = _get(
    newDetails,
    "newDetails.fmEntity.legalEntity.legalEntityOrgDetails.empRelationship[0]"
  );
  newDetails.fmEntity.legalEntity.regulatoryInfo = extractFromRegulatoryInfo(
    _get(newDetails, "newDetails.fmEntity.legalEntity.regulatoryInfo") || []
  );

  newDetails.fmEntity.legalEntity.creditGrade = {
    creditGradeCodeValue: isGSAMClient(
      _get(newDetails, "newDetails.fmEntity.legalEntity.creditGrade") || []
    )
      ? "Y"
      : "N",
  };
  newDetails.fmEntity.fmSysContact = {
    addrLine:
      newDetails.fmEntity.fmSysContact.find(
        (item) => item.mediumUsage === "BIC" || null
      )?.addrLine || null,
  };

  return newDetails;
}

interface CounterpartyDetailsProps {
  isBookingEntity?: boolean;
  tradeDetails: any;
  disableRightClick?: any;
}
export const CounterpartyDetailsV2: FC<CounterpartyDetailsProps> = memo(
  ({ isBookingEntity = false, tradeDetails, disableRightClick }) => {
    const [allDetails, setAllDetails] = useState<any>({});
    /*  Disabled View SSI
     *  const [isOpenSSIList, setIsOpenSSIList] = useState(false);
     *  const [isOpenSSIDetails, setIsOpenSSIDetails] = useState(false);
     *  const [ssiDetails, setSsiDetails] = useState();
     */
    const [details, setDetails] = useState<any>();
    const [isQuery, setIsQuery] = useState(false);
    /* Disabled View SSI
     * const exception = {
     *   data: {
     *     counterpartyFmLeid: tradeDetails.Entity?.Counterparty_SCI_FMID,
     *     disableRightClick,
     *   },
     * };
     *
     * const viewSSI = () => {
     *   setIsOpenSSIList(true);
     * };
     */

    useEffect(() => {
      if (!isEmpty(details) && !isEmpty(tradeDetails)) {
        if (Object.keys(details).length > 0) {
          const newDetails = washData(details);

          const copyDetails = Object.assign({}, newDetails, {
            Physical_Status: tradeDetails.Physical_Status,
            Counterparty_Name: tradeDetails.Entity.Counterparty_Name,
          });
          const allDetails = flatten(deepClone(copyDetails));
          setAllDetails(allDetails);
        }
      }
    }, [details, tradeDetails]);

    /*  Disabled View SSI
     *  const openDetails = (data: any) => {
     *    setIsOpenSSIDetails(true);
     *    setSsiDetails(data);
     *  };
     */

    useEffect(() => {
      if (tradeDetails && !isQuery) {
        const fmId = isBookingEntity
          ? tradeDetails.Entity?.Booking_Entity_SCIFMID
          : tradeDetails.Entity?.Counterparty_SCI_FMID;
        setIsQuery(true);
        if (fmId) {
          queryCounterPartyDetails(fmId)
            .then((res: any) => {
              if (res.fmEntity.legalEntity) {
                setDetails(res);
              } else {
                setDetails({});
              }
            })
            .catch(() => {
              setDetails({});
            });
        }
      }
    }, [tradeDetails, isQuery]);

    return (
      <RootStyle>
        <div
          className="counterparty-details-pop"
          data-testid={"counterparty-details-pop"}
        >
          <DetailsLoading
            details={details}
            allDetails={allDetails}
            isBookingEntity={isBookingEntity}
          />
          {/*  Disabled View SSI
           *  <Button
           *    className="ssi-cashflow-btn"
           *    id="viewSsiCtpy"
           *    onClick={viewSSI}
           *    variant="contained"
           *  >
           *    View SSI
           *  </Button>
           */}
        </div>
        {/* Disabled View SSI
         *  <SsiLists
         *    open={isOpenSSIList}
         *    onClose={() => setIsOpenSSIList(false)}
         *    exception={exception}
         *    isMultiSSI={false}
         *    onOpenForm={openDetails}
         *  />
         *  <ViewSSI
         *    isOpen={isOpenSSIDetails}
         *    details={ssiDetails}
         *    onClose={() => setIsOpenSSIDetails(false)}
         *  />
         */}
      </RootStyle>
    );
  }
);
