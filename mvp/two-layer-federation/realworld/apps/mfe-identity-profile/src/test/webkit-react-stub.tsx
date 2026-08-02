import React from 'react';

type WebKitProps = React.PropsWithChildren<{
  readonly [key: string]: unknown;
}>;

const text = (value: unknown) => typeof value === 'string' ? value : undefined;
const bool = (value: unknown) => value === true;

export function createComponent(tagName: string): React.ComponentType<WebKitProps> {
  function WebKitTestComponent(props: WebKitProps) {
    const label = text(props['aria-label']) ?? text(props.label);
    const onClick = props.onClick as React.MouseEventHandler<HTMLButtonElement> | undefined;

    if (tagName === 'sc-button' || tagName === 'sc-icon-button' || tagName === 'sc-tab') {
      return <button
        type="button"
        role={tagName === 'sc-tab' ? 'tab' : 'button'}
        aria-label={label}
        aria-expanded={props['aria-expanded'] as boolean | undefined}
        disabled={bool(props.disabled)}
        onClick={onClick}
      >{props.children ?? text(props.name)}</button>;
    }
    if (tagName === 'sc-text-input') {
      const handleInput = props.onScInput as ((event: { detail: { value: string } }) => void) | undefined;
      const common = {
        id: text(props.id),
        value: (props.value ?? '') as string | number,
        disabled: bool(props.disabled),
        required: bool(props.required),
        'aria-label': label,
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          handleInput?.({ detail: { value: event.target.value } }),
      };
      return <label>{text(props.label)}
        {bool(props.multiline)
          ? <textarea {...common} rows={props.rows as number | undefined} />
          : <input {...common} type={text(props.type) ?? 'text'} />}
        {props.errorMessage ? <span>{String(props.errorMessage)}</span> : null}
      </label>;
    }
    if (tagName === 'sc-dialog') {
      return bool(props.open) ? <div role="dialog" aria-label={label}>{props.children}</div> : null;
    }
    if (tagName === 'sc-alert') {
      return <div role={text(props.role) ?? 'alert'}><strong>{text(props.title)}</strong>{props.children}</div>;
    }
    if (tagName === 'sc-badge') {
      return <span aria-label={label} data-color={text(props.color)}>{text(props.label) ?? props.children}</span>;
    }
    if (tagName === 'sc-avatar') {
      return <span role="img" aria-label={label}>{props.children}</span>;
    }
    if (tagName === 'sc-menu') {
      return <div role="menu" aria-label={label}>{props.children}</div>;
    }
    if (tagName === 'sc-menu-item') {
      return <button type="button" role="menuitem" aria-label={label} onClick={onClick}>{props.children}</button>;
    }
    if (tagName === 'sc-tab-panel') {
      return <div role="tabpanel">{props.children}</div>;
    }
    return <section aria-label={label}>{props.children}</section>;
  }

  WebKitTestComponent.displayName = `WebKitTest(${tagName})`;
  return WebKitTestComponent;
}
