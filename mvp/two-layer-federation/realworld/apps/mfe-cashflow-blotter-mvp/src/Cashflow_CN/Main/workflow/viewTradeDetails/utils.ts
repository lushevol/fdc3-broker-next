export const transformDataSourceForTrade = (datasource: string) => {
  switch ((datasource + "").toLowerCase()) {
    case "murex":
      return "Murex";

    default:
      break;
  }
  return datasource;
};
