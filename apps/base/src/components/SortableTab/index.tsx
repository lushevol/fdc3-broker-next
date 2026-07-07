import React, { type ReactElement } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SortableTabProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';

const SortableTab: React.FC<SortableTabProps> = (props: SortableTabProps): ReactElement => {
  const { id, active, onClick, onDoubleClick, children } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : undefined,
  };

  return (
    <Root
      ref={setNodeRef}
      active={active ? 'true' : 'false'}
      style={style}
      data-testid={`${PREFIX}-${id}`}
      {...attributes}
      {...listeners}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </Root>
  );
};

export default React.memo(SortableTab);
