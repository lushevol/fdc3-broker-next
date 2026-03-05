class ResultsToolbar extends HTMLElement {
  static get observedAttributes() {
    return [
      "title",
      "current-count",
      "total-count",
      "load-next-label",
      "settings-label",
      "info-message",
      "resize-label",
      "export-label"
    ];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  getAttr(name, fallback = "") {
    return this.getAttribute(name) ?? fallback;
  }

  render() {
    const title = this.getAttr("title", "Results");
    const currentCount = this.getAttr("current-count", "1139");
    const totalCount = this.getAttr("total-count", "52959");
    const loadNextLabel = this.getAttr("load-next-label", "Load next 1000");
    const settingsLabel = this.getAttr("settings-label", "Settings");
    const infoMessage = this.getAttr(
      "info-message",
      "If more than 1000 records are loaded, column filters below will be applied only within the first 1000 records."
    );
    const resizeLabel = this.getAttr("resize-label", "Resize");
    const exportLabel = this.getAttr("export-label", "Export File");

    this.innerHTML = `
      <footer class="cashflow__results results-toolbar" aria-label="Result controls">
        <section class="results-toolbar__summary" aria-label="Result summary">
          <h3 class="results-toolbar__title">${title}</h3>
          <p class="results-toolbar__count"><span aria-label="Current displayed count">${currentCount}</span>/<span aria-label="Total count">${totalCount}</span></p>
          <button class="button button--outline" type="button">${loadNextLabel}</button>
          <button class="button button--icon" type="button" aria-label="${settingsLabel}">${settingsLabel}</button>
        </section>

        <section class="results-toolbar__notice" aria-label="Information message">
          <p>${infoMessage}</p>
          <button class="button button--icon" type="button" aria-label="Dismiss info">Close</button>
        </section>

        <section class="results-toolbar__tags" aria-label="Applied filters">
          <ul class="results-toolbar__tag-list"></ul>
        </section>

        <section class="results-toolbar__actions" aria-label="Grid actions">
          <button class="button button--outline" type="button">${resizeLabel}</button>
          <button class="button button--outline" type="button">${exportLabel}</button>
        </section>
      </footer>
    `;
  }
}

customElements.define("results-toolbar", ResultsToolbar);
