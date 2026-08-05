import { html, LitElement } from 'lit';

export class HomeContent extends LitElement {

  render() {
    return html`
        <div>
            <h2>What's next ?</h2>
            <ul>
                <li>Learn how to develop your plugin from <a href="http://go/servicebench/develop-plugin" target="blank">http://go/servicebench/develop-plugin</a></li>
                <li>Ask plugin-related questions / technical support on Service Bench Team channel: <a href="http://go/chat/sb-plugin" target="blank">http://go/chat/servicebench</a></li>
                <li>Learn more about the platform: <a href="http://go/learnservicebench" target="blank">http://go/learnservicebench</a></li>
                <li>Contact us at <a href="mailto:servicebench@sc.com" target="blank">servicebench@sc.com</a></li>
            </ul>
        </div>
    `;
  }
  
}
