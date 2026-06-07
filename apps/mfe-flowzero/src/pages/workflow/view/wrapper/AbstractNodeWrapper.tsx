import { FC } from "react";
import { BaseNodeProps } from "src/pages/workflow/view/wrapper/nodeLayout/BaseLayout";

import { AbstractWorkflowNode } from "../../model/entities/reactflowElement/AbstractWorkflowNode";
import { WorkflowNodeType } from "../../types/nodeTypes";
import { NodeFactory } from "../factory/NodeFactory";

export abstract class AbstractNodeWrapper<T = any> {
  /**
   * Reference to NodeFactory for accessing view components
   */
  protected workflowNodeFactory: NodeFactory;

  /**
   * The workflow node entity (Model layer)
   */
  protected workflowNodeEntity: AbstractWorkflowNode<T>;

  /**
   * React component for rendering the node (View layer)
   */
  protected children: FC<BaseNodeProps>;

  /**
   * Constructor
   * @param nodeFactory - NodeFactory instance
   * @param nodeEntity - The workflow node entity
   */
  constructor(nodeFactory: NodeFactory, nodeEntity: AbstractWorkflowNode<T>) {
    this.workflowNodeFactory = nodeFactory;
    this.workflowNodeEntity = nodeEntity;

    // Get the view component from factory based on node type
    const nodeComponent = NodeFactory.getNodeLayoutByType(
      nodeEntity.type as WorkflowNodeType
    );

    if (!nodeComponent) {
      throw new Error(
        `No view component found for node type: ${nodeEntity.type}`
      );
    }

    this.children = nodeComponent;
  }

  /**
   * Get the node entity (Model)
   */
  getEntity(): AbstractWorkflowNode<T> {
    return this.workflowNodeEntity;
  }

  /**
   * Get the view component
   */
  getComponent(): FC<BaseNodeProps> {
    return this.children;
  }

  /**
   * Get the node type
   */
  getType(): string {
    return this.workflowNodeEntity.type;
  }

  /**
   * Handle opening properties panel
   * Opens the properties configuration panel for this node
   */
  onOpenProperties(): void {
    const propertiesPanel = NodeFactory.getPanelFormByType(
      this.workflowNodeEntity.type as WorkflowNodeType
    );

    if (propertiesPanel) {
      // Emit event or call callback to open properties panel
      this.handleOpenPropertiesPanel(propertiesPanel);
    } else {
      console.warn(
        `No properties panel found for node type: ${this.workflowNodeEntity.type}`
      );
    }
  }

  /**
   * Handle node click event
   * Can be overridden by subclasses for custom click behavior
   */
  onClick(): void {
    // Default behavior: select the node
    this.handleNodeClick();
  }

  /**
   * Handle opening properties panel (to be implemented by concrete classes)
   * @param panelComponent - The properties panel component
   */
  protected abstract handleOpenPropertiesPanel(panelComponent: FC<any>): void;

  /**
   * Handle node click (to be implemented by concrete classes)
   */
  protected abstract handleNodeClick(): void;

  render(props: Partial<BaseNodeProps>): JSX.Element {
    const Component = this.children;
    const nodeProps: BaseNodeProps = {
      data: {
        label: this.workflowNodeEntity.label,
        subLabel: this.workflowNodeEntity.subLabel,
        ...props.data,
      },
      nodeId: props.nodeId,
      onDelete: props.onDelete,
      ...props,
    };

    return <Component {...nodeProps} />;
  }

  /**
   * Get node properties for serialization
   */
  getProperties(): T {
    return this.workflowNodeEntity.properties;
  }

  /**
   * Update node properties
   * @param properties - New properties
   */
  updateProperties(properties: Partial<T>): void {
    this.workflowNodeEntity.properties = {
      ...this.workflowNodeEntity.properties,
      ...properties,
    };
  }

  /**
   * Validate the node
   */
  validate(): boolean {
    return this.workflowNodeEntity.validation();
  }

  /**
   * Get the model representation of the node
   */
  getModel(): any {
    return this.workflowNodeEntity.getModel();
  }
}
