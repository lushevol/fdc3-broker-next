import React from 'react';
import ErrorBoundry from '../ErrorBoundry';
import type { ModalProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';
import Field from './Field';

const TableDetail: React.FC<ModalProps> = (props: ModalProps): React.ReactElement => {
  const {
    title,
    isDraggable,
    isResizeble,
    isLoading,
    defaultWidth,
    defaultHeight,
    actionComponents,
    record,
    columns,
    onChange,
    resetId,
  } = props;
  const _titleComponents = React.useMemo(() => title, [record, columns, isLoading]);
  const _actionComponents = React.useMemo(() => actionComponents, [record, columns, isLoading]);
  return (
    <ErrorBoundry>
      <Root
        className={classes.root}
        data-testid={`${PREFIX}`}
        open={true}
        disabledClose
        isDraggable={isDraggable}
        isResizeble={isResizeble}
        actionComponents={_actionComponents}
        titleComponents={_titleComponents}
        disablePortal={true}
        hideBackdrop={false}
        defaultWidth={defaultWidth}
        defaultHeight={defaultHeight}
        dividers
      >
        <div className={classes.content}>
          <div className={classes.center}>
            {record &&
              columns.map((column, columnId) => (
                <Field
                  column={column}
                  columnId={columnId}
                  record={record}
                  onChange={onChange}
                  resetId={resetId}
                  key={`Field-${column.field}`}
                />
              ))}
          </div>
        </div>
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(TableDetail);
