/**
 * Resolver UI Type Definitions
 *
 * This module contains all TypeScript interfaces and types used by the FDC3 resolver UI components.
 * These types define the contract between the resolver dialog and the FDC3 broker for intent resolution.
 *
 * @packageDocumentation
 */

import type { AppMetadata, Context } from '@finos/fdc3';

/**
 * Represents a target application displayed in the resolver UI.
 *
 * A resolver target represents an application (or application instance) that can handle
 * a specific intent with a given context. This interface combines the app's metadata
 * with runtime state information like instance ID and current context.
 *
 * @example
 * ```typescript
 * const target: ResolverTarget = {
 *   appId: 'my-chart-app',
 *   instanceId: 'chart-app-001',
 *   metadata: {
 *     appId: 'my-chart-app',
 *     name: 'Chart App',
 *     title: 'Advanced Charting',
 *     description: 'Display financial charts',
 *     icons: [{ src: 'icon.png', size: 'md' }]
 *   },
 *   currentContext: {
 *     type: 'fdc3.instrument',
 *     name: 'Apple Inc.',
 *     id: { ticker: 'AAPL' }
 *   }
 * };
 * ```
 *
 * @see {@link ResolverDialogProps.targets} - Used in the resolver dialog
 * @see {@link AppCardProps} - Individual card props
 */
export interface ResolverTarget {
  /**
   * The application identifier as registered in the FDC3 App Directory.
   *
   * This uniquely identifies the application within the FDC3 ecosystem.
   */
  appId: string;

  /**
   * Optional instance identifier for targeting a specific running instance.
   *
   * When provided, the intent will be delivered to this specific instance rather than
   * launching a new instance. If not provided, the broker may launch a new instance.
   */
  instanceId?: string;

  /**
   * App metadata from the FDC3 App Directory.
   *
   * Contains display information including name, title, description, icons, and other
   * metadata needed to render the app in the resolver UI.
   */
  metadata: AppMetadata;

  /**
   * Optional current context of this app instance.
   *
   * When available, this shows the context currently being used by the app instance,
   * helping users understand the state before selecting the target.
   */
  currentContext?: Context;
}

/**
 * Props for the {@link ResolverDialog} component.
 *
 * The resolver dialog is displayed when multiple applications can handle an intent,
 * requiring user selection to determine which target should receive the intent.
 *
 * @example
 * ```typescript
 * function MyResolver() {
 *   const [open, setOpen] = useState(false);
 *
 *   const handleSelect = (target: ResolverTarget) => {
 *     console.log('Selected:', target.appId);
 *     setOpen(false);
 *   };
 *
 *   const handleCancel = () => {
 *     setOpen(false);
 *   };
 *
 *   return (
 *     <ResolverDialog
 *       open={open}
 *       intent="ViewChart"
 *       context={{ type: 'fdc3.instrument', id: { ticker: 'AAPL' } }}
 *       targets={[target1, target2, target3]}
 *       onSelect={handleSelect}
 *       onCancel={handleCancel}
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link ResolverDialog} - The component using these props
 * @see {@link ResolverTarget} - The target type definition
 */
export interface ResolverDialogProps {
  /**
   * Controls whether the dialog is currently visible.
   *
   * When `false`, the component renders `null`. When `true`, the dialog is displayed
   * as a modal overlay covering the entire viewport.
   *
   * @default false
   */
  open: boolean;

  /**
   * The intent type being resolved.
   *
   * This is the name of the intent that triggered the resolver, such as "ViewChart",
   * "StartCall", etc. Displayed to the user in the dialog header.
   *
   * @example
   * ```typescript
   * intent="ViewChart"
   * intent="StartCall"
   * intent="ViewContacts"
   * ```
   */
  intent: string;

  /**
   * The context data for the intent.
   *
   * This is the FDC3 context object that will be delivered to the selected target.
   * Displayed in a formatted JSON preview to help users verify the data.
   *
   * @example
   * ```typescript
   * context={{
   *   type: 'fdc3.instrument',
   *   name: 'Apple Inc.',
   *   id: { ticker: 'AAPL' }
   * }}
   * ```
   */
  context: Context;

  /**
   * Array of available target applications.
   *
   * Each target represents an application or instance that can handle the intent
   * with the given context. The dialog renders these as selectable cards.
   *
   * @example
   * ```typescript
   * targets={[
   *   { appId: 'chart-app-1', metadata: {...}, currentContext: {...} },
   *   { appId: 'chart-app-2', metadata: {...}, currentContext: {...} }
   * ]}
   * ```
   */
  targets: ResolverTarget[];

  /**
   * Callback fired when the user selects a target application.
   *
   * This is called when the user clicks or presses Enter on an app card.
   * The selected target is passed as the argument.
   *
   * @param target - The resolver target that was selected
   * @example
   * ```typescript
   * const handleSelect = (target: ResolverTarget) => {
   *   broker.raiseIntent(intent, context, target.appId);
   *   setOpen(false);
   * };
   * ```
   */
  onSelect: (target: ResolverTarget) => void;

  /**
   * Callback fired when the user cancels the resolution.
   *
   * This is called when the user clicks the Cancel button, presses Escape,
   * or clicks outside the dialog. Use this to close the dialog and handle
   * the cancellation (e.g., reject a pending promise).
   *
   * @example
   * ```typescript
   * const handleCancel = () => {
   *   setOpen(false);
   *   reject(new Error('User cancelled'));
   * };
   * ```
   */
  onCancel: () => void;
}

/**
 * Props for the {@link AppCard} component.
 *
 * An AppCard displays a single target application in the resolver UI,
 * showing its icon, name, description, instance ID, and current context.
 *
 * @example
 * ```typescript
 * function MyAppCard() {
 *   const [selected, setSelected] = useState(false);
 *
 *   return (
 *     <AppCard
 *       app={appMetadata}
 *       instanceId="chart-app-001"
 *       currentContext={{ type: 'fdc3.instrument', ... }}
 *       selected={selected}
 *       focused={false}
 *       onClick={() => setSelected(true)}
 *       onDoubleClick={() => handleLaunch(app)}
 *       tabIndex={0}
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link AppCard} - The component using these props
 * @see {@link ResolverTarget} - The target data structure
 */
export interface AppCardProps {
  /**
   * The app's metadata from the FDC3 App Directory.
   *
   * Contains display information including name, title, description, icons,
   * and other metadata needed to render the card.
   *
   * @example
   * ```typescript
   * app={{
   *   appId: 'my-chart-app',
   *   name: 'Chart App',
   *   title: 'Advanced Charting',
   *   description: 'Display financial charts',
   *   icons: [{ src: 'icon.png', size: 'md', type: 'image/png' }]
   * }}
   * ```
   */
  app: AppMetadata;

  /**
   * Optional instance identifier.
   *
   * When present, indicates a specific running instance of the application.
   * Displayed on the card to help users distinguish between multiple instances.
   *
   * @example
   * ```typescript
   * instanceId="chart-app-001"
   * ```
   */
  instanceId?: string;

  /**
   * Optional current context of this app instance.
   *
   * When available, shows the context currently being used by the app instance.
   * Displayed in a monospace preview on the card.
   *
   * @example
   * ```typescript
   * currentContext={{
   *   type: 'fdc3.instrument',
   *   name: 'Apple Inc.',
   *   id: { ticker: 'AAPL' }
   * }}
   * ```
   */
  currentContext?: Context;

  /**
   * Whether this card is visually selected.
   *
   * When `true`, the card is highlighted with a blue border and background
   * to indicate it's the currently selected target.
   *
   * @default false
   */
  selected: boolean;

  /**
   * Whether this card currently has keyboard focus.
   *
   * When `true`, the card receives keyboard focus and shows a focus ring.
   * Only one card should be focused at a time. Used in conjunction with
   * the {@link useResolverKeyboard} hook for keyboard navigation.
   *
   * @default false
   */
  focused: boolean;

  /**
   * Click event handler.
   *
   * Called when the user clicks the card. Typically used to select the target.
   *
   * @example
   * ```typescript
   * onClick={() => handleSelect(target)}
   * ```
   */
  onClick: () => void;

  /**
   * Double-click event handler.
   *
   * Called when the user double-clicks the card. Can be used for quick launch
   * or instant selection behavior.
   *
   * @example
   * ```typescript
   * onDoubleClick={() => handleLaunch(target)}
   * ```
   */
  onDoubleClick: () => void;

  /**
   * Tab index for keyboard navigation.
   *
   * Controls the element's position in the tab order. Should be `0` for the
   * focused card and `-1` for all others to ensure only one card is focusable
   * at a time (managed by the {@link useResolverKeyboard} hook).
   *
   * @example
   * ```typescript
   * tabIndex={focused ? 0 : -1}
   * ```
   */
  tabIndex: number;
}

/**
 * Props for the {@link ContextPreview} component.
 *
 * The ContextPreview component displays the FDC3 context data in a formatted
 * JSON view, allowing users to verify the data before selecting a target.
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const context = {
 *     type: 'fdc3.instrument',
 *     name: 'Apple Inc.',
 *     id: { ticker: 'AAPL' }
 *   };
 *
 *   return <ContextPreview context={context} />;
 * }
 * ```
 *
 * @see {@link ContextPreview} - The component using these props
 */
export interface ContextPreviewProps {
  /**
   * The FDC3 context data to display.
   *
   * This can be any valid FDC3 context type (instrument, contact, organization, etc.).
   * The component formats this as pretty-printed JSON for easy readability.
   *
   * @example
   * ```typescript
   * context={{
   *   type: 'fdc3.instrument',
   *   name: 'Apple Inc.',
   *   id: { ticker: 'AAPL' }
   * }}
   * ```
   */
  context: Context;
}
