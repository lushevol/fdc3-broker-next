import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type {
  CustomMarkContextMenuEvent,
  CustomView,
  DeviceType,
  FilterChangedEvent,
  MarksSelectedEvent,
  ParameterChangedEvent,
  StoryPointSwitchedEvent,
  TabSwitchedEvent,
  Toolbar,
  ToolbarStateChangedEvent,
  UrlActionEvent,
  VizSize,
} from '@tableau/embedding-api';
import { TableauReportCustomParameter, TableauReportFilter, TableauReportParameter } from './typings.js';

export abstract class TableauReportProperties extends LitElement {
  /**
   * Represents the full Tableau script path including the hostname
   * Example: https://crr-tableau.hk.standardchartered.com/javascripts/api/tableau.embedding.3.latest.min.js
   */
  @property({
    type: String,
  })
    scriptPath: string;

  /**
   * Represents the full Tableau report path including the hostname
   * Example: https://crr-tableau.hk.standardchartered.com/t/DynamicRiskMonitoring/views/FFGEWRA_v3/OP_New2
   */
  @property({
    type: String,
  })
    reportPath: string;

  /**
   * Represents width in pixels
   * Can be any valid CSS size specifier. If not specified, defaults to the published width of the view.
   */
  @property({
    type: String,
    attribute: 'width',
  })
    width?: string | number;

  /**
   * Represents height in pixels
   * Can be any valid CSS size specifier. If not specified, defaults to the published height of the view.
   */
  @property({
    type: String,
    attribute: 'height',
  })
    height?: string | number;

  /**
   * Indicates whether to suppress the execution of URL actions. This option does not prevent the URL action
   * event from being raised. You can use this option to change what happens when a URL action occurs. If set
   * to true, and you create an event listener for the URL_ACTION event, you can use an event listener
   * handler to customize the actions.

   *
   * ```
   * <tableau-viz id="tableauViz" disable-url-actions />
   * ```
   */
  @property({
    type: Boolean,
    attribute: 'disable-url-actions-popups',
  })
    disableUrlActionsPopups?: boolean;

  /**
   * Indicates whether tabs are hidden or shown.
   *
   * ```
   * <tableau-viz id="tableauViz"  hide-tabs />
   * ```
   */
  @property({
    type: Boolean,
    attribute: 'hide-tabs',
  })
    hideTabs?: boolean;

  /**
   * Specifies the position of the toolbar, if it is shown. The values can be Toolbar.Top,
   * Toolbar.Bottom or Toolbar.Hidden.
   * If not specified, defaults to Toolbar.Bottom.
   *
   * ```
   * <tableau-viz id="tableauViz"  toolbar="hidden" />
   * ```
   */
  @property({
    type: String,
    attribute: 'toolbar',
  })
    toolbar?: Toolbar;

  /**
   * Specifies a device layout for a dashboard, if it exists.
   * Values can be default, desktop, tablet, or phone.
   * If not specified, defaults to loading a layout based on the
   * smallest dimension of the hosting iframe element.
   *
   * ```
   * <tableau-viz id="tableauViz"  device="desktop" />
   * ```
   */
  @property({
    type: String,
    attribute: 'device',
  })
    device?: DeviceType;

  /**
   * Specifies the ID of an existing instance to make a copy (clone) of.
   * This is useful if the user wants to continue analysis of an existing visualization
   * without losing the state of the original. If the ID does not refer to an existing visualization,
   * the cloned version is derived from the original visualization.
   *
   * ```
   * <tableau-viz id="tableauViz"  instance-id-to-clone="id1" />
   * ```
   */
  @property({
    type: String,
    attribute: 'instance-id-to-clone',
  })
    instanceIdToClone?: string;

  /**
   * Indicates whether the Edit button is hidden or visible.
   * If not set, defaults to false, meaning that the Edit button is visible.
   * ```
   * <tableau-viz id="tableauViz" hide-edit-button>
   * ```
   */
  @property({
    type: Boolean,
    attribute: 'hide-edit-button',
  })
    hideEditButton?: boolean;

  /**
   * An event raised when the user clicks on the Edit Button.
   * ```
   * <tableau-viz id="tableauViz" onEditButtonClicked="onEditButtonClickedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onEditButtonClicked?: (event: CustomEvent) => void;

  /**
   * An event raised when any filter has changed state. You can use this event type with TableauViz objects.
   * ```
   * <tableau-viz id="tableauViz" onFilterChanged="onFilterChangedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onFilterChanged?: (event: CustomEvent<{ detail: FilterChangedEvent }>) => void;

  /**
   * An event raised when a custom mark context menu is clicked.
   * ```
   * <tableau-viz id="tableauViz" onCustomMarkContextMenuEvent="onCustomMarkContextMenuEventHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onCustomMarkContextMenuEvent?: (
    event: CustomEvent<{
      detail: CustomMarkContextMenuEvent;
    }>
  ) => void;

  /**
   * An event raised when the selected marks on a visualization have changed. You can use this event type with TableauViz objects.
   * ```
   * <tableau-viz id="tableauViz" onMarkSelectionChanged="onMarkSelectionChangedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onMarkSelectionChanged?: (event: CustomEvent<{ detail: MarksSelectedEvent }>) => void;

  /**
   * An event raised when a parameter has had its value modified. You can use this event type with [[Parameter]] objects.
   * ```
   * <tableau-viz id="tableauViz" onParameterChanged="onParameterChangedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onParameterChanged?: (event: CustomEvent<{ detail: ParameterChangedEvent }>) => void;

  /**
   * An event raised when a toolbar button or control becomes available or becomes unavailable.
   * ```
   * <tableau-viz id="tableauViz" onToolbarStateChanged="onToolbarStateChangedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onToolbarStateChanged?: (event: CustomEvent<{ detail: ToolbarStateChangedEvent }>) => void;

  @property({
    attribute: false,
  })
    onWorkbookReadyToClose?: (event: CustomEvent) => void;

  @property({
    attribute: false,
  })
    onWorkbookPublished?: (event: CustomEvent) => void;

  @property({
    attribute: false,
  })
    onWorkbookPublishedAs?: (event: CustomEvent<{ detail: { newUrl?: any } }>) => void;

  /**
   * An event raised when a URL action occurs. See the {@link UrlActionEvent} class.
   * ```
   * <tableau-viz id="tableauViz" onUrlAction="onUrlActionHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onUrlAction?: (event: CustomEvent<{ detail: UrlActionEvent }>) => void;

  /**
   * An event raised after a tab switch occurs (the active sheet has changed). Guarantees the viz object will be interactive after this.
   * ```
   * <tableau-viz id="tableauViz" onTabSwitched="onTabSwitchedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onTabSwitched?: (event: CustomEvent<{ detail: TabSwitchedEvent }>) => void;

  /**
   * An event raised when a custom view has finished loading. This event is raised after the callback
   * function for {@link FirstInteractive} (if any) has been called.
   * ```
   * <tableau-viz id="tableauViz" onCustomViewLoaded="onCustomViewLoadedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onCustomViewLoaded?: (event: CustomEvent<{ customView: CustomView }>) => void;

  /**
   * An event raised when a custom view has been removed.
   * ```
   * <tableau-viz id="tableauViz" onCustomViewRemoved="onCustomViewRemovedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onCustomViewRemoved?: (event: CustomEvent<{ customView: CustomView }>) => void;

  /**
   * An event raised when a custom view has been saved (newly created or updated).
   * ```
   * <tableau-viz id="tableauViz" onCustomViewSaved="onCustomViewSavedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onCustomViewSaved?: (event: CustomEvent<{ customView: CustomView }>) => void;

  /**
   * An event raised when a custom view has been set as the default view for a workbook.
   * ```
   * <tableau-viz id="tableauViz" onCustomViewSetDefault="onCustomViewSetDefaultHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onCustomViewSetDefault?: (event: CustomEvent<{ customView: CustomView }>) => void;

  /**
   * An event raised after a new story point becomes active.
   * ```
   * <tableau-viz id="tableauViz" onStoryPointSwitched="onStoryPointSwitchedHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onStoryPointSwitched?: (event: CustomEvent<{ details: StoryPointSwitchedEvent }>) => void;

  /**
   * Indicates whether to touch optimize viz controls.
   *
   * ```
   * <tableau-viz id="tableauViz" touch-optimize />
   * <tableau-authoring-viz id="tableauViz" touch-optimize />
   * ```
   */
  @property({
    type: Boolean,
    attribute: 'touch-optimize',
  })
    touchOptimize?: boolean;

  /**
   * Indicates whether the Edit in Desktop button is hidden or visible.
   * If not specified, defaults to false, meaning that the Edit in Desktop button is visible.
   *
   * ```
   * <tableau-viz id="tableauViz" hide-edit-in-desktop-button>
   * <tableau-authoring-viz id="tableauViz" hide-edit-in-desktop-button>
   * ```
   */
  @property({
    type: Boolean,
    attribute: 'hide-edit-in-desktop-button',
  })
    hideEditInDesktopButton?: boolean;

  /**
   * Indicates whether the default edit behavior is suppressed.
   * If not specified, defaults to false, meaning that the default edit behavior is not suppressed.
   *
   * ```
   * <tableau-viz id="tableauViz" suppress-default-edit-behavior>
   * <tableau-authoring-viz id="tableauViz" suppress-default-edit-behavior>
   * ```
   */
  @property({
    type: Boolean,
    attribute: 'suppress-default-edit-behavior',
  })
    suppressDefaultEditBehavior?: boolean;

  /**
   An event raised when the user clicks on the Edit In Desktop Button. You can use this event type with TableauViz objects.

   <tableau-viz></tableau-viz>
   <tableau-authoring-viz></tableau-authoring-viz>

   */ @property({
    attribute: false,
  })
    onEditInDesktopButtonClicked?: (event: CustomEvent) => void;

  /**
   * An event raised when the size of the viz is known. You can use this event to perform tasks such as resizing
   * the elements surrounding the Viz object once the object's size has been established.
   * ```
   * <tableau-viz id="tableauViz" "onFirstVizSizeKnown"="onFirstVizSizeKnownHandler" />
   * <tableau-authoring-viz id="tableauViz" onFirstVizSizeKnown="onFirstVizSizeKnownHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onFirstVizSizeKnown?: (event: CustomEvent<{ vizSize: VizSize }>) => void;

  /**
   * An event raised when the Viz object first becomes interactive. This is only raised once.
   * ```
   * <tableau-viz id="tableauViz" "onFirstInteractive"="onFirstInteractiveHandler" />
   * <tableau-authoring-viz id="tableauViz" onFirstInteractive="onFirstInteractiveHandler" />
   * ```
   */
  @property({
    attribute: false,
  })
    onFirstInteractive?: (event: CustomEvent) => void;

  /**
   * The token used for authorization
   *
   * ```
   * <tableau-viz id="tableauViz" token="some-token-containing-clientId" />
   * <tableau-authoring-viz id="tableauViz" token="some-token-containing-clientId" />
   * <tableau-ask-data id="tableauAskData" token="some-token-containing-clientId" />
   * ```
   */
  @property({
    type: String,
    attribute: 'token',
  })
    token?: string;

  /**
   * Indicates whether the non-minified version of JavaScript is loaded. If specified (or set to true), the
   * non-minified version is used for both the local component and the Tableau Server visualization (if enabled).
   * If not specified (or set to false), the minified version of the JavaScript files are loaded.
   *
   * ```
   * <tableau-viz id="tableauViz" debug />
   * <tableau-authoring-viz id="tableauViz" debug />
   * <tableau-ask-data id="tableauAskData" debug />
   * ```
   */
  @property({
    type: Boolean,
    attribute: 'debug',
  })
    debug?: boolean;

  /**
   * Indicates whether to use the old auth mechanism for authentication which happens inside the iframe. If specified, VizLoadErrorEvents
   * triggered due to auth failures will not be thrown.
   *
   * ```
   * <tableau-viz id="tableauViz" iframe-auth />
   * <tableau-authoring-viz id="tableauViz" iframe-auth />
   * <tableau-ask-data id="tableauAskData" iframe-auth />
   * ```
   */
  @property({
    type: Boolean,
    attribute: 'iframe-auth',
  })
    iframeAuth?: boolean;

  /**
   * The value of the 'loading' attribute of the embedded iframe.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#loading
   *
   * ```
   * <tableau-viz id="tableauViz" iframe-attr-loading="lazy" />
   * <tableau-authoring-viz id="tableauViz" iframe-attr-loading="lazy" />
   * <tableau-pulse id="tableauPulse" iframe-attr-loading="lazy" />
   * ```
   */
  @property({
    type: String,
    attribute: 'iframe-attr-loading',
  })
    iframeAttributeLoading?: string;

  /**
   * The value of the 'style' attribute of the embedded iframe.
   *
   * ```
   * <tableau-viz id="tableauViz" iframe-attr-style="border: 1px solid red" />
   * <tableau-authoring-viz id="tableauViz" iframe-attr-style="border: 1px solid red" />
   * <tableau-pulse id="tableauPulse" iframe-attr-style="border: 1px solid red" />
   * ```
   */
  @property({
    type: String,
    attribute: 'iframe-attr-style',
  })
    iframeAttributeStyle?: string;

  /**
   * The value of the 'class' attribute of the embedded iframe providing access to any
   * custom selectors defined in the `<iframe-style>` child tag.
   *
   * ```
   * <tableau-viz id="tableauViz" iframe-attr-class="red-border">
   *   <iframe-style>
   *     .red-border {
   *       border: 1px solid red;
   *     }
   *   </iframe-style>
   * </tableau-viz>
   * ```
   */
  @property({
    type: String,
    attribute: 'iframe-attr-class',
  })
    iframeAttributeClass?: string;

  /**
   * Represents the filters applied to the Tableau report
   */
  @property({ type: Array })
    filters?: TableauReportFilter[];

  /**
   * Represents the parameters applied to the Tableau report
   */
  @property({ type: Array })
    parameters?: TableauReportParameter[];

  /**
   * Represents the custom parameters applied to the Tableau report
   */
  @property({ type: Array })
    customParameters?: TableauReportCustomParameter[];
}
