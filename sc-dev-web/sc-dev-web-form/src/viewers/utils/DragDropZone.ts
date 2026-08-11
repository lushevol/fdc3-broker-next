import { html } from 'lit';
import { getParent } from '../../shared/utils.js';
import { Component } from '../../models/Component.js';

export function dragStart(e: any) {
  e.dataTransfer.setData('text/plain', e.target.id);
  e.dataTransfer.setData('text/className', e.target.className);
}

export function dragEnter(e: any) {
  e.preventDefault();
  e.target.classList.add('drag-over');
  // e.target.classList.add('highlight');
}

export function dragOver(e: any) {
  e.stopPropagation();
  e.preventDefault();
  e.target.classList.add('drag-over');
}

export function dragLeave(e: any) {
  e.target.classList.remove('drag-over');
  // e.target.classList.remove('highlight');
}

export function drop(e: any) {
  e.preventDefault();
  e.stopPropagation();
  console.log('className', e.dataTransfer.getData('text/className'));
  if (e.dataTransfer.getData('text/className') === 'component-box') {
    e.target.classList.remove('drag-over');
    // e.target.classList.remove('highlight');
    return [e.dataTransfer.getData('text/plain'), e.target.id];
  } else {
    e.target.classList.remove('drag-over');
    // e.target.classList.remove('highlight');
  }
}

export const reorderArrayBasedOnIndex = (arrayObject: any[], newIndexArray: any[]) => {
  // Step 1: Create a map to associate old indices with elements
  const oldIndexMap: any = {};
  arrayObject.forEach((element, index) => {
    oldIndexMap[index] = element;
  });

  // Step 2: Sort the array based on new indices
  const sortedArray = newIndexArray.map(item => oldIndexMap[item.oid]);
  return sortedArray;
};

interface DROP_EVENT {
  (e: Event): any
}

type FunctionWithParam = (key: any) => unknown;

interface LABEL_EVENT {
  (): any
}

export const renderDragDropZone = (dropCallback: DROP_EVENT, highlighting?: boolean, placeholderFn?: LABEL_EVENT, c?: Component) => {
  const renderStyle = () => {
    return html`
      <style>
        .drop-container {
          border-radius: 0.625rem;
          width: -webkit-fill-available;
          margin: auto;
          padding: 0.625rem 0;
          min-height: 5vh;
          flex: 1;
        }
    
        .row-placeholder {
          padding: 1.25rem;
        }

        .drop-container.highlight .row-placeholder {
          border: 0.0625rem dashed var(--sc-form-designer-drop-zone-border-color, var(--sc-color-blue-500));
          background-color: var(--sc-box-info-background-color, var(--sc-color-blue-50));
        }
        .drop-container.highlight .row-placeholder.active {
          background: var(--sc-dropdown-item-background-hover-color, var(--sc-color-blue-100));
        }
      </style>
    `;
  };
  return html`
    ${renderStyle()}
    <div 
      class="drop-container ${highlighting ? 'highlight' : ''}"
      @dragover=${dragOver}
      @dragleave=${dragLeave}
      @drop=${dropCallback}
    >
      <div 
        class='row-placeholder ${highlighting ? 'highlight' : ''}'
        @dragover=${onPlaceholderDragOver}
        @dragleave=${onDragLeave}
      >
        ${placeholderFn ? placeholderFn() : ''}
      </div>
    </div>
  `;
};

export const onDragStart = (e: DragEvent) => {
  e.stopPropagation();

  const target = e.target as HTMLInputElement;
  e.dataTransfer?.setData('text/plain', target.id);
};

export const cleanEmptyColumns = (row: HTMLInputElement) => {
  if (!row) return;
  const columns = row.querySelectorAll('sc-grid-column');
  Array.from(columns).forEach(col => {
    if (!col.textContent) {
      row.removeChild(col);
    }
  });
};

const creatEmptyElement = (sibling: any, position: string, moveComponent?: FunctionWithParam) => {
  const newNode = document.createElement('sc-grid-column');
  newNode.className = 'column-placeholder';
  newNode.setAttribute('id', sibling.id);
  newNode.setAttribute('data-insert-position', position);
  newNode.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
  });
  newNode.addEventListener('dragleave', onDragLeave);
  newNode.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    onDrop(e, moveComponent);
  });
  return newNode;
};

export function onDragOver(e: any, moveComponent?: FunctionWithParam) {
  e.preventDefault();
  const { clientX } = e;
  const parent = getParent(e.target, 'fieldblock');
  const parentColumn = getParent(parent, 'grid-column');
  const parentRow = getParent(parent, 'grid-row');
  cleanEmptyColumns(parentRow);
  if (parent.className.includes('container')) return;
  const eleInfo = parent.getBoundingClientRect();
  const { left, right, width } = eleInfo;

  if (clientX > left && clientX < (left + width / 2)) { // Create new on the left
    if (parentRow) {
      const newNode = creatEmptyElement(parent, 'before', moveComponent);
      parentRow.insertBefore(newNode, parentColumn);      
    }
  } else if (clientX > (left + width / 2) && clientX < right) { // Create new on the right
    if (parentRow) {
      const newNode = creatEmptyElement(parent, 'after', moveComponent);
      parentColumn.after(newNode);
    }
  }

  parent.classList.add('drag-over');
  // parent.classList.add('highlight');
}

export function onPlaceholderDragOver(e: any) {
  e.preventDefault();
  e.target.classList.add('active');
}

export function onDragLeave(e: any) {
  e.preventDefault();
  e.target.classList.remove('active');
}

export function onDragEnd(e: any) {
  if (e.target?.className?.includes('column-placeholder') || e.target.querySelector('.column-placeholder')) {
    const parentRow = getParent(e.target, 'grid-row');
    cleanEmptyColumns(parentRow);
  }
}

export function onDrop(e: any, moveComponent?: FunctionWithParam) {
  e.preventDefault();
  e.stopPropagation();
  const parent = getParent(e.target, 'fieldblock');
  parent.classList.remove('drag-over');
  // parent.classList.remove('highlight');

  moveComponent?.(e);
}

export function onMouseEnter(e: MouseEvent) {
  const target = e.target as HTMLInputElement;
  target.classList.add('hover');
  const parentRow = getParent(target, 'grid-row');
  cleanEmptyColumns(parentRow);
}

export function onMouseLeave(e: MouseEvent) {
  const target = e.target as HTMLInputElement;
  target.classList.remove('hover');
}