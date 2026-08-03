import { property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { Component } from '../../../models/Component.js';
import { drop, reorderArrayBasedOnIndex } from '../../utils/DragDropZone.js';
import { FormDefinition } from '../../../models/FormDefinition.js';
import { formContext } from '../../contexts/form-context.js';
import { dragDropContext } from '../../contexts/drag-drop-context.js';
import { customComponentsContext } from '../../contexts/custom-components-context.js';
import { BaseEditor } from './BaseEditor.js';
import type { CUSTOM_COMPONENT } from '../../types.js';
import { ComponentTypes } from '../../../shared/componentTypes.js';

export class ContainerBaseEditor extends BaseEditor {
  // @ts-ignore
  @consume({ context: formContext, subscribe: true })
  @property({ attribute: false }) 
    formDefinition: FormDefinition;

  // @ts-ignore
  @consume({ context: customComponentsContext })
  @property({ attribute: false }) 
    customComponents: CUSTOM_COMPONENT[];

  // @ts-ignore
  @consume({ context: dragDropContext })
  @state() 
    dragDropState: {
      _highlighting: boolean;
    };

  get page() {
    return this.formDefinition.getPage(this._selectedPage?.id);
  }

  matchComponentType(type: string) {
    let _type;
    Object.keys(ComponentTypes).some(key => {
      const currentComponent = ComponentTypes[key].replace(/ /g, '');
      if (type.includes(currentComponent) || type.includes(key)) {
        _type = key;
        return true;
      }
    });
    if (!_type) {
      // check in custom components
      const customComponent = this.customComponents.find(c => type.includes(c.id));
      if (customComponent) {
        _type = customComponent.id;
      }
    }
    return _type;
  }

  onDrop(e: any, tabId?: string, stepId?: string, callback?: any, index?: number) {
    const sourceId = e.dataTransfer.getData('text/plain');
    const type = (drop(e) as any) ? (drop(e) as any)?.[0] : this.matchComponentType(sourceId);
    if (type !== undefined) {
      let properties;
      if (this.customComponents) {
        const component = this.customComponents.find(c => c.id === type);
        properties = component?.element?.properties;
      }
      let newAdded;
      if (index !== undefined && index !== null) {
        let subComponent = this.component?.components[index];
        if (subComponent) {
          subComponent = Component.from(subComponent).addComponent(type, tabId, properties, stepId)?.self;
          this.component.components[index] = subComponent;
        }
      } else {
        newAdded = Component.from(this.component).addComponent(type, tabId, properties, stepId);
        this.component = newAdded.self;
      }
      this.page?.updateComponent(this.component.id, this.component);
      if (this.dragDropState) {
        this.dragDropState._highlighting = false;
      }
      callback?.(newAdded);
      this.page?.removeComponent(sourceId);
      this.requestUpdate();
      this.onSave();
    }
    this.requestUpdate();
  }

  onSave() {
    this.emit('form-updated', {
      composed: true,
      bubbles: true,
      detail: {
        definition: this.formDefinition,
      },
    });
  }

  updateComponent = (components: Component[]) => {
    this.component.components = components;
    this.page?.updateComponent(this.component.id, this.component);
    this.requestUpdate();
  };

  reorderContainerComponent(arrangement: any) {
    let tempArry: any[] = [...this.component.components];
    tempArry = reorderArrayBasedOnIndex(tempArry, arrangement);
    this.updateComponent(tempArry);
  }

  reorderGridComponent(arrangement: any, index: number) {
    let tempArry: any[] = [...this.component.components[index]];
    tempArry = reorderArrayBasedOnIndex(tempArry, arrangement);
    this.updateComponent(tempArry);
  }

  getFilterOption(_options: any) {
    const filteredOptions = _options.filter((option: any) => ((option.id || option.name) || (option.id || option.title)  || (option.label || option.value)));
    if (filteredOptions.length !== _options.length) {
      return filteredOptions;
    }
    return _options;
  }
}