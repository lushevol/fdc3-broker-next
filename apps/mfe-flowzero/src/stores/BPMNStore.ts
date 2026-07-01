import { action, makeAutoObservable, observable } from "mobx";
import { BPMNServiceInstance } from "src/service";
import BpmnModdleEntity from "src/service/BpmnService";

import CaseManager from "./common/CaseManager";

class BPMNStore {
  private api: BPMNServiceInstance;
  status: string = "init";
  dataSource: string = "";
  nodes: any = [];
  edges: any = [];

  async loadCaseById(id: string) {
    switch (id) {
      case "CASE1":
      case "CASE2":
        const xmlStr = await CaseManager(id);
        this.parseWorkflowModel(xmlStr);
        break;
      default:
        this.loadMapDefine();
    }
  }

  /**
   * For Control the page layout
   */
  menuSelected: string = "";

  selectMenu(menu: string) {
    this.menuSelected = menu;
  }

  async parseWorkflowModel(xmlStr: string) {
    const model = new BpmnModdleEntity();
    await model.formXML(xmlStr);
    this.edges = model.getEdges();
    this.nodes = model.getNode();
  }

  private loadMapDefine() {
    const nodes = [
      {
        id: "start-event-1",
        type: "StartEventNode",
        position: { x: 80, y: 80 },
        data: { label: "Initiate Request", subLabel: "Start Event" },
      },
    ];
    this.nodes = nodes;
    this.edges = [];
  }
  constructor(context: { api: BPMNServiceInstance }) {
    this.api = context.api;
    this.loadMapDefine();
    makeAutoObservable(this, {
      status: observable,
      dataSource: observable,
      loadCaseById: action,
      nodes: observable,
      edges: observable,

      /**
       * Page Control
       */
      menuSelected: observable,
      selectMenu: action,
    });
  }
}

export default BPMNStore;
