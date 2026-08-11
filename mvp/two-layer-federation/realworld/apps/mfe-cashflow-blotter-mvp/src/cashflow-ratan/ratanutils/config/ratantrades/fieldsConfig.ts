export const FXArray = [
  "Exchanged_Currency1_Payment_Amount_Currency",
  "Exchanged_Currency2_Payment_Amount_Currency",
  "Exchanged_Currency1_Receiver_Party_Reference",
  "Exchanged_Currency2_Receiver_Party_Reference",
  "Exchanged_Currency1_Payer_Party_Reference",
  "Exchanged_Currency2_Payer_Party_Reference",
];

export const formatBuySell = (param: any) => {
  const { data } = param;
  let direction: string = "";

  if (data?.Forward_Future_Instrument || data?.Cash_Financial_Instrument) {
    const value =
      data.Forward_Future_Instrument || data.Cash_Financial_Instrument;
    if (
      (value[FXArray[4]] && value[FXArray[4]] === "party2") ||
      (value[FXArray[2]] && value[FXArray[2]] === "party1") ||
      (value[FXArray[3]] && value[FXArray[3]] === "party2") ||
      (value[FXArray[5]] && value[FXArray[5]] === "party1")
    ) {
      direction = `Buy ${value[FXArray[0]]} / Sell ${value[FXArray[1]]}`;
    } else if (
      (value[FXArray[4]] && value[FXArray[4]] === "party1") ||
      (value[FXArray[2]] && value[FXArray[2]] === "party2") ||
      (value[FXArray[3]] && value[FXArray[3]] === "party1") ||
      (value[FXArray[5]] && value[FXArray[5]] === "party2")
    ) {
      direction = `Sell ${value[FXArray[0]]} / Buy ${value[FXArray[1]]}`;
    }
  }
  return direction;
};

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
};

const validationStatusValueMapping = {
  VALIDATED: "Validated",
  ECONAFFIRMED: "Econ Affirmed",
  PENDING_VALIDATED: "Pending Validated",
};
export const handleReviewStatus = (params: any) => {
  return (
    validationStatusValueMapping[params.value] ||
    params.value
      ?.split("_")
      .map((item) => capitalizeFirstLetter(item))
      .join(" ")
  );
};

export const PRODUCT_DESCRIPTION_FIELDS = [
  {
    name: "Product",
    title: "Product",
    fields: [
      {
        label: "Payoff ID",
        field: "Test_Payoff_Id",
      },
      {
        label: "Asset Class",
        field: "Test_Asset_Class",
      },
      {
        label: "Product Class",
        field: "Test_Product_Class",
      },
      {
        label: "Product Grouping",
        field: "Test_Product_Grouping",
      },
      {
        label: "Pricing Capability",
        field: "Test_Pricing_Capability",
      },
      {
        label: "Booking Type",
        field: "Test_Booking_Type",
      },
      {
        label: "Booking Model",
        field: "Test_Booking_Model",
      },
      {
        label: "Booking Systems",
        field: "Test_Booking_Systems",
      },
      {
        label: "Dodd-Frank Eligibility",
        field: "Test_Dod",
      },
    ],
  },
];
