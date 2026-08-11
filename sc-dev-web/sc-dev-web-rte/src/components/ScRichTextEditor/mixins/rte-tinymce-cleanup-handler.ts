import { Editor } from 'hugerte';

/**
 * Handles the cleanup of orphaned UI artifacts left by TinyMCE plugins.
 */
export class RteCleanupHandler {
  private editor: Editor;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly debounceDelay = 150;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  /**
   * Checks if any visible table elements exist. If not, it aggressively removes all
   * known table plugin UI artifacts ('ephox-' elements) from the entire iframe document.
   */
  public cleanupArtifacts() {
    if (!this.editor || this.editor.removed) {
      return;
    }

    // Get the entire document of the iframe
    const doc = this.editor.getDoc();
    if (!doc) return;

    // Get the body from the document for content checking
    const body = doc.body;
    if (!body) return;

    // Logic to check for visible tables
    const allTables = body.querySelectorAll('table');
    let hasVisibleTableContent = false;
    if (allTables.length > 0) {
      hasVisibleTableContent = Array.from(allTables).some(
        table => (table.textContent || '').trim().length > 0
      );
    }

    // If there are no tables with actual content, proceed with cleanup
    if (!hasVisibleTableContent) {
      // Search the entire document for artifacts
      const tableArtifacts = doc.querySelectorAll('[class*="ephox-"]');

      if (tableArtifacts.length > 0) {
        tableArtifacts.forEach(el => el.remove());

        // After modifying the DOM, fire a resize event to fix "ghost scrollbar" issue
        this.editor.fire('ResizeEditor');
      }
    }
  }

  public debouncedCleanup = () => {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(
      () => this.cleanupArtifacts(),
      this.debounceDelay
    );
  };

  public destroy() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }
}
