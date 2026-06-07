import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { WorkflowActionExtraOptions } from "src/Cashflow_CN/Main/common/interface";
import { failedRightMenu } from "src/Cashflow_CN/Main/workflow/failed/FailedWrap";
import { manualSettleRightMenu } from "src/Cashflow_CN/Main/workflow/manualSettle";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";

import {
  adhocCommentRightMenu,
  earlyMaterializationRightMenu,
} from "../../../Main/workflow/earlyMaterialization/EarlyMaterializationWrap";
import { holdRightMenu } from "../../../Main/workflow/hold";
import { netCashflowRightMenu } from "../../../Main/workflow/netCashflow/netCashflowRightMenu";
import { unNetCashflowRightMenu } from "../../../Main/workflow/netCashflow/unNetCashflowRightMenu";
import { settlementMethodUpdateRightMenu } from "../../../Main/workflow/settlementMethodUpdate/utils/rightmenu";
import { splittingCashflowRightMenu } from "../../../Main/workflow/splitting/SplittingCashflowRightMenu";
import { swiftSuppressRightMenu } from "../../../Main/workflow/swiftSuppress/SwiftSuppress";
import {
  isShowSwiftMessage,
  openCashflowDetailDialog,
} from "../../../Main/workflow/viewCashflowDetails/viewCashflowDetailsRightMenu";
import { openTradeDetailsDialog } from "../../../Main/workflow/viewTradeDetails/viewTradeDetailsRightMenu";
import { bulkRightMenu } from "../../BulkFixExceptions/utils/rightmenu";
import {
  CASHFLOW_DETAILS_TAB,
  HISTORY_TAB,
  SWIFT_MESSAGE_TAB,
} from "../../CashflowDetails/detailsBody";
/**
 * Create Class for right-click menu builder
 * receive context and param in constructor
 * each method is to add specific right-click menu
 * toResult method to return final menu list
 */
class RightClickMenuBuilder {
  private readonly params: GetContextMenuItemsParams<CNCashflow>;
  private result: MenuItemDef<CNCashflow>[] = [];
  private readonly options: WorkflowActionExtraOptions;

  constructor(
    params: GetContextMenuItemsParams<CNCashflow>,
    options: WorkflowActionExtraOptions
  ) {
    this.params = params;
    this.options = options;
  }

  // Utility function to exclude menus based on conditions
  private excludeMenus(): boolean {
    const selectedRows = this.params.api?.getSelectedRows();
    const hoverRow = this.params.node?.data ?? {};

    return (
      selectedRows?.some((row) => row.Settlement_Method === "UTIL") ||
      hoverRow.Settlement_Method === "UTIL"
    );
  }

  addBulkRightMenu() {
    const bulkMenu = bulkRightMenu(this.params, this.options);
    if (bulkMenu) {
      this.result.push(bulkMenu);
    }
    return this;
  }

  addNetCashflowRightMenu() {
    const netMenu = netCashflowRightMenu(this.params, this.options);
    if (netMenu && !this.excludeMenus()) {
      this.result.push(netMenu);
    }
    return this;
  }

  addUnNetCashflowRightMenu() {
    const unNetMenu = unNetCashflowRightMenu(this.params, this.options);
    if (unNetMenu && !this.excludeMenus()) {
      this.result.push(unNetMenu);
    }
    return this;
  }

  addHoldRightMenu() {
    const holdMenus = holdRightMenu(this.params, this.options).filter(
      (menu) => menu && !this.excludeMenus()
    );
    this.result.push(...holdMenus);
    return this;
  }

  addEarlyMaterializationRightMenu() {
    const earlyMaterializationMenu = earlyMaterializationRightMenu(
      this.params,
      this.options
    );
    if (
      (!this.excludeMenus() ||
        (this.excludeMenus() &&
          !["Early Release", "Settle As Gross", "Update Affirmation"].includes(
            earlyMaterializationMenu?.name ?? ""
          ))) &&
      earlyMaterializationMenu
    ) {
      this.result.push(earlyMaterializationMenu);
    }
    return this;
  }

  addAdhocCommentRightMenu() {
    const adhocCommentMenu = adhocCommentRightMenu(this.params, this.options);
    if (adhocCommentMenu) {
      this.result.push(adhocCommentMenu);
    }
    return this;
  }

  addFailedRightMenu() {
    const failedMenu = failedRightMenu(this.params, this.options);
    if (failedMenu && !this.excludeMenus()) {
      this.result.push(failedMenu);
    }
    return this;
  }

  addManualSettleRightMenu() {
    const manualSettleMenu = manualSettleRightMenu(this.params, this.options);
    if (manualSettleMenu) {
      this.result.push(manualSettleMenu);
    }
    return this;
  }

  addSwiftSuppressRightMenu() {
    const swiftMenus = swiftSuppressRightMenu(this.params, this.options).filter(
      (menu) => menu && !this.excludeMenus()
    );
    this.result.push(...swiftMenus);
    return this;
  }

  addSplittingCashflowRightMenu() {
    if (featureScopedEnabled("Manual_Splitting")) {
      const splittingMenus = splittingCashflowRightMenu(
        this.params,
        this.options
      ).filter((menu) => menu && !this.excludeMenus());
      this.result.push(...splittingMenus);
    }
    return this;
  }

  addSettlementMethodUpdateRightMenu() {
    const settlemethodUpdateMenu = settlementMethodUpdateRightMenu(
      this.params,
      this.options
    );
    if (settlemethodUpdateMenu) {
      this.result.push(settlemethodUpdateMenu);
    }
    return this;
  }

  addViewTradeDetailsRightMenu() {
    const node = this.params.node?.data;
    if (
      node &&
      !(
        node?.Cashflow?.Cashflow_State !== "NETTED" &&
        node?.Cashflow?.Netting_Id
      )
    ) {
      this.result.push({
        name: "View Trade Details",
        disabled: !node.Trade_Id,
        tooltip: !node.Trade_Id ? "Trade Id is null" : "",
        action: () => {
          openTradeDetailsDialog(node, this.options);
        },
      });
    }
    return this;
  }

  addViewSwiftMessage() {
    const node = this.params.node?.data;
    if (node && isShowSwiftMessage(node)) {
      this.result.push({
        name: "View Swift Message",
        action: () => {
          openCashflowDetailDialog(node, SWIFT_MESSAGE_TAB, this.options);
        },
      });
    }
    return this;
  }

  addViewCashflowDetailsRightMenu() {
    const node = this.params.node?.data;
    if (node) {
      this.result.push({
        name: "View Cashflow Details",
        action: () => {
          openCashflowDetailDialog(node, CASHFLOW_DETAILS_TAB, this.options);
        },
      });
      this.result.push({
        name: "View Cashflow History",
        action: () => {
          openCashflowDetailDialog(node, HISTORY_TAB, this.options);
        },
      });
    }
    return this;
  }

  toResult(): MenuItemDef[] {
    return this.result;
  }
}

export default RightClickMenuBuilder;
