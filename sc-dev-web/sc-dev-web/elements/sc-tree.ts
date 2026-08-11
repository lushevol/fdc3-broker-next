import { defineElement } from "./define-element.js";
import { ScTree } from "../src/components/ScTree/ScTree.js";
export * from "../src/components/ScTree/ScTree.js";

defineElement("sc-tree", ScTree);

declare global {
  interface HTMLElementTagNameMap {
    "sc-tree": ScTree;
  }
}
