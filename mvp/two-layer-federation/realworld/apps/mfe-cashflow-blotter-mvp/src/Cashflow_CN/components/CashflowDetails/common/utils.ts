import xmlFormat from "xml-formatter";
export const generateEmptyGraphQLCashflowDetails = (
  details: CNCashflow
): GraphqlCashflowDetails => ({
  cashflow: details,
  cashflowAuditTrail: [],
  ratanException: [],
  ratanNostroCandidates: [],
  ratanVostroCandidates: [],
  ratanAffirmation: null,
});

export const isValidGraphQLCashflowDetails = (
  details: GraphqlCashflowDetails
) => {
  const { cashflow, cashflowAuditTrail } = details;
  return cashflow?.Confirmation ?? cashflowAuditTrail?.length;
};

export const formattedXml = (xmlString: string | null) => {
  if (!xmlString) return "";
  return xmlFormat(xmlString, {
    indentation: "  ",
    collapseContent: true,
    lineSeparator: "\n",
  });
};
