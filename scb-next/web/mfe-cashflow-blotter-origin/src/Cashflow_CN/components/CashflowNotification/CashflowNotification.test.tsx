import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";
import MfeThemeProvider from "src/Root/common/component/MfeThemeProvider";
import { renderWithProviders } from "src/test/test-utils";

import { matchFilters } from "./CashflowNotificationSubscriber";
import CashflowNotificationDialogWrap, { LEVEL2_NOTIFICATION_DOM_ANCHOR } from "./dialogWrap";
import CashflowNotification from "./index";
import { consumeNotification } from "./NotificationConsumer";

afterAll(() => {
  vi.clearAllMocks();
});

describe("Cashflow Notification Component", () => {
    it("should be in the document", async () => {
        const { container } = renderWithProviders(<CashflowNotification />, {
          preloadedState: defaultPreloadedState,
        });
        expect(container).not.toBeEmptyDOMElement();
    });
});

describe("Cashflow Notification Dialog Wrap", () => {
    it("should be in the document", async () => {
        const handleClickRefresh = vi.fn();
        const { queryByTestId } = renderWithProviders(
          <MfeThemeProvider>
            <div className={LEVEL2_NOTIFICATION_DOM_ANCHOR}>mock dialog</div>
            <CashflowNotificationDialogWrap active={true}>
                <div data-testid="dialog-content"></div>
            </CashflowNotificationDialogWrap>
          </MfeThemeProvider>, {
          preloadedState: {
            ...defaultPreloadedState,
            dialogRefreshAlert: {
              showAlert: true,
              onClickRefresh: handleClickRefresh,
            },
          }
        });
        expect(queryByTestId("dialog-content")).toBeInTheDocument();
        expect(queryByTestId("cashflow-notification-dialog-wrap")).toBeInTheDocument();
    });
});

describe("Cashflow Notification Tools", () => {
  it("Notification Consumer", async () => {
    const tableCashflows = JSON.parse(JSON.stringify([mockCashflow1]));
    const notificationCashflows = JSON.parse(JSON.stringify([mockCashflow1]));
    notificationCashflows[0].Cashflow.Cashflow_Minor_Version += 1;
    const [hittedCashflows, droppedCashflows] = matchFilters(
      notificationCashflows,
      [
        {
          field: "Cashflow.Cashflow_State",
          operator: "EQ",
          values: "WAITING",
        }
      ]
    );
    const { isUpdate } =
      await consumeNotification({
        getCurrentTableDatas: () => Promise.resolve(tableCashflows),
        dataToUpdates: hittedCashflows,
        dataToDelete: droppedCashflows,
        rowKey: "Cashflow.Cashflow_Id",
        isDataUpdated: () => true,
      });
    expect(isUpdate).toBeTruthy();
  });
});
