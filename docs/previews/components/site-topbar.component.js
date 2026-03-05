class SiteTopbar extends HTMLElement {
  static get observedAttributes() {
    return [
      "title",
      "tile-label",
      "theme-label",
      "theme-checked",
      "time-value",
      "time-label",
      "time-checked",
      "profile-label",
      "feedback-label",
      "tile-href",
      "profile-href",
      "feedback-href"
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

  getBool(name, fallback = false) {
    const value = this.getAttribute(name);
    if (value === null) return fallback;
    return value === "" || value === "true" || value === "1";
  }

  renderAction(label, href, className, ariaLabel) {
    if (href) {
      return `<a class="${className}" href="${href}" aria-label="${ariaLabel}">${label}</a>`;
    }
    return `<button class="${className}" type="button" aria-label="${ariaLabel}">${label}</button>`;
  }

  render() {
    const title = this.getAttr("title", "FMO Post Trade Portal");
    const tileLabel = this.getAttr("tile-label", "New Tile");
    const themeLabel = this.getAttr("theme-label", "Dark");
    const themeChecked = this.getBool("theme-checked", false);
    const timeValue = this.getAttr("time-value", "01:47 UTC");
    const timeLabel = this.getAttr("time-label", "UTC");
    const timeChecked = this.getBool("time-checked", true);
    const profileLabel = this.getAttr("profile-label", "Profile");
    const feedbackLabel = this.getAttr("feedback-label", "Feedback");

    const tileHref = this.getAttr("tile-href");
    const profileHref = this.getAttr("profile-href");
    const feedbackHref = this.getAttr("feedback-href");

    this.innerHTML = `
      <header class="portal__header topbar" role="banner">
        <div class="topbar__brand">
          <h1 class="topbar__title">${title}</h1>
        </div>

        <nav class="topbar__actions" aria-label="Global actions">
          ${this.renderAction(tileLabel, tileHref, "topbar__action-button topbar__action-button--tile", "Open new tile")}

          <div class="topbar__theme-switch" role="group" aria-label="Theme settings">
            <label class="topbar__switch-label" for="theme-toggle">${themeLabel}</label>
            <input id="theme-toggle" class="topbar__switch-input" type="checkbox" aria-label="Toggle theme" ${themeChecked ? "checked" : ""}>
          </div>

          <div class="topbar__time-switch" role="group" aria-label="Time mode">
            <span class="topbar__time-value" aria-live="polite">${timeValue}</span>
            <label class="topbar__switch-label" for="time-toggle">${timeLabel}</label>
            <input id="time-toggle" class="topbar__switch-input" type="checkbox" aria-label="Toggle UTC or local time" ${timeChecked ? "checked" : ""}>
          </div>

          ${this.renderAction(profileLabel, profileHref, "topbar__icon-button topbar__icon-button--profile", "Open profile menu")}
          ${this.renderAction(feedbackLabel, feedbackHref, "topbar__icon-button topbar__icon-button--feedback", "Share feedback")}
        </nav>
      </header>
    `;
  }
}

customElements.define("site-topbar", SiteTopbar);
