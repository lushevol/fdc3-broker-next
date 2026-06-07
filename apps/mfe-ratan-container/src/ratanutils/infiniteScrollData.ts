export const onGridBodyScroll = (data: any) => {
  let isGridFetchedAll = false;
  let isGridFetchingData = false;

  data.params.api.addEventListener("gridFetchedAllData", (item: any) => {
    isGridFetchedAll = item.isGridFetchedAll;
  });

  data.params.api.addEventListener("gridFetchingData", (paramsObj: any) => {
    isGridFetchingData = paramsObj.isGridFetchingData;
  });

  data.params.api.addEventListener("bodyScroll", (params: any) => {
    const lastDisplayedRow = data.params.api.getLastDisplayedRow();
    const totalCount = data.params.api.getDisplayedRowCount();
    const triggerApiCount = totalCount - 2;
    if (
      lastDisplayedRow > triggerApiCount &&
      !isGridFetchedAll &&
      lastDisplayedRow > 0 &&
      typeof data.gridAction === "function" &&
      !isGridFetchingData &&
      data.params.api.getVerticalPixelRange().top > 0
    ) {
      isGridFetchingData = true;
      data.params.api.showLoadingOverlay();
      data.gridAction();
    }
  });
};
