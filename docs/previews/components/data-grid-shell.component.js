class DataGridShell extends HTMLElement {
  static get observedAttributes() {
    return ["title", "columns", "empty-message"];
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

  parseColumns() {
    const raw = this.getAttribute("columns");
    if (!raw) {
      return ["Select", "Cashflow Id", "Cashflow State", "Trade Id", "Value Date", "Currency", "Amount"];
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(String);
    } catch {
      // Ignore invalid JSON and fallback to CSV parsing.
    }

    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  render() {
    const title = this.getAttr("title", "Cashflow Blotter Grid");
    const emptyMessage = this.getAttr("empty-message", "Grid rows rendered by application runtime.");
    const columns = this.parseColumns();

    const headCells = columns
      .map((column, index) => {
        const isSelect = index === 0;
        return `<th class="data-grid__cell${isSelect ? " data-grid__cell--select" : ""}" scope="col">${column}</th>`;
      })
      .join("");

    this.innerHTML = `
      <section class="cashflow__grid data-grid" aria-label="Cashflow data table">
        <header class="data-grid__header">
          <h3 class="visually-hidden">${title}</h3>
        </header>

        <div class="data-grid__viewport" role="region" aria-label="Scrollable cashflow table">
          <table class="data-grid__table">
            <caption class="visually-hidden">Cashflow blotter records</caption>
            <thead class="data-grid__head">
              <tr class="data-grid__row data-grid__row--head">
                ${headCells}
              </tr>
            </thead>
            <tbody class="data-grid__body">
              <tr class="data-grid__row">
                <td class="data-grid__cell" colspan="${Math.max(columns.length, 1)}">${emptyMessage}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    `;
  }
}

customElements.define("data-grid-shell", DataGridShell);
