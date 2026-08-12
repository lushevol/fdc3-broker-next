import { FC } from "react";
import cn from "classnames";

import { isEmpty } from "../../../ratanutils/utils";
import { Loading } from "../../../ratancomponents/Loading";
import { InfoPop } from "../InfoPop";
import { InfoPart } from "../InfoPart";
import { COUNTERPARTY_DETAILS_CONFIG } from "./counterpartyDetailsConfig";
import { classes } from "./style";

interface CustomTdDisplayProps {
  allDetails: any;
  item: any;
  popArray: any;
  isPartTwo?: boolean;
}
const CustomTdDisplay: FC<CustomTdDisplayProps> = ({
  allDetails,
  item,
  popArray,
  isPartTwo,
}) => {
  if (item.isPart) {
    const className = isPartTwo ? classes.isPartTwo : "";
    return popArray.length > 0 ? (
      <td colSpan={item.colspan || 1}>
        <InfoPart
          className={className}
          item={item}
          partDetail={popArray}
          details={allDetails}
        />
      </td>
    ) : null;
  } else if (item.isPop) {
    return popArray.length > 0 ? (
      <>
        <td>{item.key}</td>
        <td>
          {allDetails[item.value]}
          <InfoPop
            popDetail={popArray}
            details={allDetails}
            detailItem={item}
          />
        </td>
      </>
    ) : null;
  }
  return (
    <>
      <td>{item.key}</td>
      <td>{allDetails[item.value]}</td>
    </>
  );
};

interface TrDomProps {
  allDetails: any;
  newArray: any[];
}
const TrDom: FC<TrDomProps> = ({ allDetails, newArray }): any => {
  return newArray.map((detailItem: any) => {
    let popArray: any = [];
    if (detailItem.isPop) {
      popArray = detailItem.popDetail.filter(
        (detailItem: any) => allDetails[detailItem.value]
      );
    }
    if (
      (detailItem.isPop && popArray.length > 0) ||
      detailItem.isPop === undefined
    ) {
      return (
        <tr key={detailItem.key}>
          <CustomTdDisplay
            allDetails={allDetails}
            item={detailItem}
            popArray={popArray}
          />
        </tr>
      );
    }
    return null;
  });
};

interface ShowTwoFieldsInOneRowProps {
  allDetails: any;
  item: any;
}
const ShowTwoFieldsInOneRow: FC<ShowTwoFieldsInOneRowProps> = ({
  allDetails,
  item,
}) => {
  const List: any = [];

  item.forEach((detailItem: any) => {
    let popArray: any = [];
    if (detailItem.isPop) {
      popArray = detailItem.popDetail.filter(
        (detailItem: any) => allDetails[detailItem.value]
      );
    }

    if (
      (detailItem.isPop && popArray.length > 0) ||
      detailItem.isPop === undefined
    ) {
      List.push(detailItem);
    }
  });

  return List.map((detailItem: any, index: number) => {
    let popArray: any = [];
    let lastPopArray: any = [];
    if (detailItem.isPop) {
      popArray = detailItem.popDetail.filter(
        (detailItem: any) => allDetails[detailItem.value]
      );
    }

    if (index % 2 !== 0) {
      if (List[index - 1].isPop) {
        lastPopArray = List[index - 1].popDetail.filter(
          (detailItem: any) => allDetails[detailItem.value]
        );
      }
      return (
        <tr key={detailItem.key}>
          <CustomTdDisplay
            allDetails={allDetails}
            item={List[index - 1]}
            popArray={lastPopArray}
          />
          <CustomTdDisplay
            allDetails={allDetails}
            item={detailItem}
            popArray={popArray}
            isPartTwo={true}
          />
        </tr>
      );
    } else if (index === List.length - 1) {
      return (
        <tr key={detailItem.key}>
          <CustomTdDisplay
            allDetails={allDetails}
            item={detailItem}
            popArray={popArray}
          />
        </tr>
      );
    } else {
      return null;
    }
  });
};

interface DetailsProps {
  allDetails: any;
  isBookingEntity: boolean;
}
const Details: FC<DetailsProps> = ({ allDetails, isBookingEntity }) => {
  const statusClassName = cn("counterparty-status-circle", {
    red: allDetails.Physical_Status === "Dead",
  });

  if (Object.keys(allDetails).length > 0) {
    return (
      <>
        <div className="counterparty-status">
          {allDetails.Physical_Status && (
            <>
              <div className={statusClassName}></div>
              {allDetails.Physical_Status}
            </>
          )}
        </div>
        {COUNTERPARTY_DETAILS_CONFIG.map((item: any) => {
          const newArray: any = item.detail.filter((detailItem: any) => {
            return allDetails[detailItem.value] || detailItem.isPop;
          });

          return (
            <div key={item.label}>
              <div className="label-details-pop">
                <table>
                  <tbody>
                    <tr className="label-details-pop-label">
                      <td colSpan={4}>
                        <div style={{ height: "25px" }}>
                          <div className="label-details-pop-name">
                            {item.label}
                          </div>
                        </div>
                        {allDetails[item.name] ? (
                          <h2 className="label-details-pop-title-main">
                            {allDetails[item.name]}
                          </h2>
                        ) : null}
                      </td>
                    </tr>
                    {item.isTwoFields ? (
                      <ShowTwoFieldsInOneRow
                        allDetails={allDetails}
                        item={newArray}
                      />
                    ) : (
                      <TrDom allDetails={allDetails} newArray={newArray} />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </>
    );
  }
  return (
    <div className="counterparty-empty-warning">
      No {isBookingEntity ? "Booking Entity" : "Counterparty"} Details Data
      Received
    </div>
  );
};

export const DetailsLoading = ({ details, allDetails, isBookingEntity }) => {
  if (!isEmpty(details)) {
    return (
      <Details allDetails={allDetails} isBookingEntity={isBookingEntity} />
    );
  }
  return <Loading loading={true} size={70} text="Loading..." />;
};
