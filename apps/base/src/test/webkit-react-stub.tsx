import React from 'react';

type WebKitProps = React.PropsWithChildren<Record<string, unknown>>;

function createComponent(tagName: string): React.ComponentType<WebKitProps> {
  const Component = React.forwardRef<HTMLElement, WebKitProps>((props, ref) => {
    const { children, onScInput, onScHide, onScSelect, onClick, ...rest } = props as WebKitProps & {
      onScInput?: (event: CustomEvent<{ value: string }>) => void;
      onScHide?: () => void;
      onScSelect?: (event: CustomEvent<{ item: { value: string } }>) => void;
      onClick?: React.MouseEventHandler<HTMLElement>;
    };
    return React.createElement(
      tagName,
      {
        ...rest,
        ref,
        role:
          rest.role ??
          (tagName === 'sc-button'
            ? 'button'
            : tagName === 'sc-modal'
              ? 'dialog'
              : undefined),
        onInput: onScInput
          ? (event: React.FormEvent<HTMLInputElement>) =>
              onScInput(new CustomEvent('sc-input', { detail: { value: event.currentTarget.value } }))
          : undefined,
        onClick: onScSelect
          ? (event: React.MouseEvent<HTMLElement>) => {
              const value = (event.target as HTMLElement).getAttribute('value') ?? '';
              onScSelect(new CustomEvent('sc-select', { detail: { item: { value } } }));
            }
          : onClick,
        onScHide,
      },
      children,
    );
  });
  Component.displayName = `WebKitTest(${tagName})`;
  return Component;
}

export { createComponent };
