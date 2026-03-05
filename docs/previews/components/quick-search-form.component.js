class QuickSearchForm extends HTMLElement {
  static get observedAttributes() {
    return [
      "quick-title",
      "custom-title",
      "toggle-label",
      "filters-label",
      "views-label",
      "clear-label",
      "modify-label",
      "search-label",
      "reset-label",
      "today-title",
      "tomorrow-title",
      "today-operator-count",
      "today-verification-count",
      "tomorrow-operator-count",
      "tomorrow-verification-count",
      "fields",
      "quick-filters"
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

  parseJsonAttribute(name, fallback) {
    const raw = this.getAttribute(name);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  defaultFields() {
    return [
      { label: "Cashflow ID", name: "cashflowId", type: "text", placeholder: "Multiple searches separated by commas" },
      { label: "Trade ID", name: "tradeId", type: "text" },
      { label: "Value Date Range", name: "valueDateRange", type: "date-range" },
      { label: "Currency", name: "currency", type: "text", placeholder: "Select..." },
      { label: "Product Taxonomy", name: "productTaxonomy", type: "text", placeholder: "Select..." },
      { label: "Counterparty FMCODE", name: "counterpartyFmcode", type: "text", placeholder: "Multiple searches separated by commas" },
      { label: "SCB Booking Entity", name: "bookingEntity", type: "text", placeholder: "Select..." },
      { label: "Beneficiary Name", name: "beneficiaryName", type: "text" },
      { label: "Beneficiary Account BIC Code", name: "beneficiaryBic", type: "text" },
      { label: "Amount Range (Is)", name: "amount", type: "number", placeholder: "Input Amount" }
    ];
  }

  defaultQuickFilters() {
    return [
      "Value Date Horizon",
      "Product Taxonomy",
      "NSTP Exception",
      "Booking Entity",
      "Cashflow State",
      "Cashflow Sub State",
      "Cashflow Sub State Type",
      "Settlement Method",
      "Bic Net Flag"
    ];
  }

  slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  renderField(field, idx) {
    const label = field.label || `Field ${idx + 1}`;
    const name = field.name || this.slugify(label) || `field_${idx + 1}`;
    const placeholder = field.placeholder || "";
    const type = field.type || "text";

    if (type === "date-range") {
      return `
        <fieldset class="quick-search__field field field--range">
          <legend class="field__label">${label}</legend>
          <div class="field__range-controls">
            <input class="field__control" name="${name}From" type="date" aria-label="${label} from">
            <input class="field__control" name="${name}To" type="date" aria-label="${label} to">
          </div>
        </fieldset>
      `;
    }

    return `
      <label class="quick-search__field field">
        <span class="field__label">${label}</span>
        <input class="field__control" name="${name}" type="${type}" ${placeholder ? `placeholder="${placeholder}"` : ""}>
      </label>
    `;
  }

  renderQuickFilter(label) {
    const name = this.slugify(label) || "quick-filter";
    return `
      <label class="quick-filters__field field">
        <span class="field__label">${label}</span>
        <input class="field__control" type="text" name="${name}">
      </label>
    `;
  }

  render() {
    const quickTitle = this.getAttr("quick-title", "Quick Search");
    const customTitle = this.getAttr("custom-title", "Custom Search/View");
    const toggleLabel = this.getAttr("toggle-label", "Hide Search Bar");
    const filtersLabel = this.getAttr("filters-label", "Filters");
    const viewsLabel = this.getAttr("views-label", "Views");
    const clearLabel = this.getAttr("clear-label", "Clear");
    const modifyLabel = this.getAttr("modify-label", "Create or Modify");
    const searchLabel = this.getAttr("search-label", "Search");
    const resetLabel = this.getAttr("reset-label", "Clear Filters");

    const todayTitle = this.getAttr("today-title", "Value Today");
    const tomorrowTitle = this.getAttr("tomorrow-title", "Value Tomorrow");

    const todayOperator = this.getAttr("today-operator-count", "1");
    const todayVerification = this.getAttr("today-verification-count", "1");
    const tomorrowOperator = this.getAttr("tomorrow-operator-count", "0");
    const tomorrowVerification = this.getAttr("tomorrow-verification-count", "0");

    const fields = this.parseJsonAttribute("fields", this.defaultFields());
    const quickFilters = this.parseJsonAttribute("quick-filters", this.defaultQuickFilters());

    this.innerHTML = `
      <section class="cashflow__search search" aria-label="Search and filters">
        <div class="search__layout">
          <section class="search__primary-panel search-panel" aria-labelledby="quick-search-title">
            <header class="search-panel__header">
              <h3 id="quick-search-title" class="search-panel__title">${quickTitle}</h3>
            </header>

            <form class="search-panel__form quick-search" action="#" method="get" novalidate>
              <fieldset class="quick-search__group">
                <legend class="visually-hidden">Core criteria</legend>
                ${fields.map((field, idx) => this.renderField(field, idx)).join("")}
              </fieldset>

              <footer class="quick-search__actions">
                <button class="button button--outline" type="reset">${resetLabel}</button>
                <button class="button button--primary" type="submit">${searchLabel}</button>
              </footer>
            </form>
          </section>

          <aside class="search__secondary-panel side-panel" aria-label="Preset counts and custom configuration">
            <section class="side-panel__card preset-card" aria-labelledby="value-today-title">
              <h3 id="value-today-title" class="preset-card__title">${todayTitle}</h3>
              <ul class="preset-card__list">
                <li class="preset-card__item"><button class="button button--text" type="button">Pending Operator (${todayOperator})</button></li>
                <li class="preset-card__item"><button class="button button--text" type="button">Pending Verification (${todayVerification})</button></li>
              </ul>
            </section>

            <section class="side-panel__card preset-card" aria-labelledby="value-tomorrow-title">
              <h3 id="value-tomorrow-title" class="preset-card__title">${tomorrowTitle}</h3>
              <ul class="preset-card__list">
                <li class="preset-card__item"><button class="button button--text" type="button">Pending Operator (${tomorrowOperator})</button></li>
                <li class="preset-card__item"><button class="button button--text" type="button">Pending Verification (${tomorrowVerification})</button></li>
              </ul>
            </section>

            <section class="side-panel__card custom-config" aria-labelledby="custom-config-title">
              <h3 id="custom-config-title" class="custom-config__title">${customTitle}</h3>

              <form class="custom-config__form" action="#" method="get">
                <label class="custom-config__field field">
                  <span class="field__label">${filtersLabel}</span>
                  <input class="field__control" name="savedFilter" type="text" placeholder="Select...">
                </label>

                <div class="custom-config__actions">
                  <button class="button button--outline" type="button">${clearLabel}</button>
                  <button class="button button--primary" type="button">${modifyLabel}</button>
                </div>

                <label class="custom-config__field field">
                  <span class="field__label">${viewsLabel}</span>
                  <input class="field__control" name="savedView" type="text" placeholder="Select...">
                </label>

                <div class="custom-config__actions">
                  <button class="button button--outline button--warning" type="button">${clearLabel}</button>
                  <button class="button button--primary" type="button">${modifyLabel}</button>
                </div>
              </form>
            </section>
          </aside>
        </div>

        <div class="search__toggle-bar">
          <button class="button button--text" type="button" aria-expanded="true" aria-controls="search-content">${toggleLabel}</button>
        </div>

        <section id="search-content" class="search__quick-filters quick-filters" aria-labelledby="quick-filters-title">
          <h3 id="quick-filters-title" class="visually-hidden">Quick Filters</h3>

          <form class="quick-filters__form" action="#" method="get">
            ${quickFilters.map((label) => this.renderQuickFilter(label)).join("")}
          </form>
        </section>
      </section>
    `;
  }
}

customElements.define("quick-search-form", QuickSearchForm);
