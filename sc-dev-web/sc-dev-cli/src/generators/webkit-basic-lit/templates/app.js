import { LitElement, html, css } from 'lit';

const logo = new URL('../assets/logo-scwebkit.svg', import.meta.url).href;

class <??= className ??> extends LitElement {

  static styles = css`
    .container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  `;

  openDocumentation() {
    window.open("http://go/scwebkit", "blank");
  }

  renderHeader() {
    return html`
      <img src="assets/logo-scwebkit.svg" alt="WebKit Logo">
      <h2>Congratulations, your WebKit project is running now.</h2>
      
      <br>
    `
  }

  renderLinks() {
    return html`
      <br>

      <h2>What's next ?</h2>
      <div style="text-align: left; min-width: 320px;">
        <ul>
          <li>Join SC WebKit community at <a href="http://go/scwebkit-community" target="blank">http://go/scwebkit-community</a> for latest updates</li>
          <li>Check feature request and ideas at <a href="http://go/scwebkit-ideas" target="blank">http://go/scwebkit-ideas</a> and start contributing</li>
          <li>Find out more about WebKit from <a href="http://go/scwebkit-info" target="blank">http://go/scwebkit-info</a></li>
          <li>Contact us at <a href="mailto:scwebkit@sc.com" target="blank">scwebkit@sc.com</a></li>
        </ul>
      </div>
    `
  }

  renderContent() {
    return html`
      <p><sc-button .onclick=${this.openDocumentation}>View components</sc-button></p>
      <p>
        This button is created using the following code in <code>app-<??= name ??>.js</code>
        <br>
        <code>&lt;sc-button .onclick=\${this.openDocumentation}&gt;View components&lt;/sc-button&gt;</code>
        <br>
        Try updating the file to try other WebKit components.
      </p>
    `
  }

  render() {
    return html`
    <div class="container">
      ${this.renderHeader()}
      ${this.renderContent()}
      ${this.renderLinks()}
    </div>
    `;
  }
}

customElements.define('app-<??= name ??>', <??= className ??>);