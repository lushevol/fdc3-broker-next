import { Editor } from 'hugerte';

export class RteViewportHandler {
  private editor: Editor | null = null;
  private editorContainer: HTMLElement | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private minHeight = 200;
  private readonly debounceDelay = 100;
  private containerHeightOffset: number | null = null; // will be measured
  private static activeHandler: RteViewportHandler | null = null;

  public initialize(
    editor: Editor,
    editorContainer: HTMLElement,
    customMinHeight?: number | string
  ) {
    this.editor = editor;
    this.editorContainer = editorContainer;

    // Use custom minimum height if provided
    if (customMinHeight) {
      this.minHeight = this.convertToPixels(customMinHeight, editorContainer);
    }

    this.measureContainerOffset();
    this.startObserving();
    // Immediate height adjustment after initialization
    requestAnimationFrame(() => this.adjustEditorHeight());
  }

  private convertToPixels(
    value: number | string,
    element: HTMLElement
  ): number {
    const fallbackHeight = 200; // Only used when no valid height is provided

    if (typeof value === 'number') {
      return value > 0 ? value : fallbackHeight;
    }

    if (typeof value === 'string') {
      // Create a temporary element to measure the actual pixel value
      const temp = document.createElement('div');
      temp.style.position = 'absolute';
      temp.style.visibility = 'hidden';
      temp.style.height = value;
      element.parentElement?.appendChild(temp);

      const pixelValue = temp.offsetHeight;
      element.parentElement?.removeChild(temp);

      if (pixelValue > 0) {
        return pixelValue;
      }
    }

    return fallbackHeight;
  }

  private measureContainerOffset() {
    if (!this.editor || !this.editorContainer) return;

    try {
      const iframe = this.editor.iframeElement;
      if (!iframe) return;

      // Get the actual height difference between container and iframe
      const containerHeight = this.editorContainer.offsetHeight;
      const iframeHeight = iframe.offsetHeight;

      if (containerHeight > 0 && iframeHeight > 0) {
        this.containerHeightOffset = containerHeight - iframeHeight;
      }
    } catch (error) {
      console.warn('Could not measure container offset, using fallback', error);
    }
  }

  private startObserving() {
    if (!this.editor) return;

    // Focus management for multi-editor scenarios
    this.editor.on('focus', () => (RteViewportHandler.activeHandler = this));
    this.editor.on('blur', () => {
      if (RteViewportHandler.activeHandler === this)
        RteViewportHandler.activeHandler = null;
    });

    // Content change listeners
    this.editor.on('SetContent', this.debouncedAdjustHeight);
    this.editor.on('input', this.debouncedAdjustHeight);
    this.editor.on('paste', () => {
      setTimeout(() => this.adjustEditorHeight(), 200);
    });

    // Handle content deletion
    this.editor.on('keydown', (e: any) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        setTimeout(() => this.adjustEditorHeight(), 50);
      }
    });

    // Re-measure offset after editor is fully initialized
    this.editor.on('init', () => {
      setTimeout(() => this.measureContainerOffset(), 100);
    });
  }

  private debouncedAdjustHeight = () => {
    clearTimeout(this.debounceTimer!);
    this.debounceTimer = setTimeout(
      () => this.adjustEditorHeight(),
      this.debounceDelay
    );
  };

  private adjustEditorHeight() {
    if (!this.editor || !this.editorContainer || this.editor.removed) return;

    // Skip adjustment until we have measured the container offset
    if (this.containerHeightOffset === null) return;

    try {
      const contentHeight = this.getContentHeight();
      const containerRect = this.editorContainer.getBoundingClientRect();
      const maxAvailableHeight = window.innerHeight - containerRect.top - 60;

      // Container should be minHeight, iframe should be minimum height minus measured offset
      const minIframeHeight = this.minHeight - this.containerHeightOffset;
      let iframeHeight = Math.max(minIframeHeight, contentHeight);

      // Add a small buffer (2px) to prevent scrollbars, but only if content exceeds minimum
      if (contentHeight > minIframeHeight) {
        iframeHeight += 2;
      }

      // Don't exceed viewport height (accounting for container offset)
      if (
        iframeHeight + this.containerHeightOffset > maxAvailableHeight &&
        maxAvailableHeight > this.minHeight
      ) {
        iframeHeight = maxAvailableHeight - this.containerHeightOffset;
      }

      let containerHeight = iframeHeight + this.containerHeightOffset;

      // Ensure container never goes below minHeight
      containerHeight = Math.max(containerHeight, this.minHeight);

      const currentHeight =
        parseInt(this.editorContainer.style.height) || this.minHeight;

      // Only update if height changed significantly to avoid flickering
      if (Math.abs(currentHeight - containerHeight) > 5) {
        this.editorContainer.style.height = `${containerHeight}px`;
        const iframe = this.editor.iframeElement;
        if (iframe) iframe.style.height = `${iframeHeight}px`;
        this.editor.fire('ResizeEditor');
      }
    } catch (error) {
      console.warn(
        'RTE Viewport Handler: Error during height adjustment',
        error
      );
    }
  }

  private getContentHeight(): number {
    if (
      !this.editor ||
      this.editor.removed ||
      this.containerHeightOffset === null
    ) {
      return this.minHeight;
    }
    try {
      const body = this.editor.getBody();
      if (!body) return this.minHeight - this.containerHeightOffset;
      // Return scrollHeight without extra padding since container offset added separately
      return body.scrollHeight;
    } catch (error) {
      console.warn('RTE Viewport Handler: Error getting content height', error);
      return this.minHeight - this.containerHeightOffset;
    }
  }

  public destroy() {
    clearTimeout(this.debounceTimer!);
    this.debounceTimer = null;

    if (RteViewportHandler.activeHandler === this) {
      RteViewportHandler.activeHandler = null;
    }

    if (this.editor && !this.editor.removed) {
      this.editor.off('focus');
      this.editor.off('blur');
      this.editor.off('SetContent', this.debouncedAdjustHeight);
      this.editor.off('input', this.debouncedAdjustHeight);
      this.editor.off('paste');
      this.editor.off('keydown');
      this.editor.off('init');
    }

    this.editor = null;
    this.editorContainer = null;
  }
}
