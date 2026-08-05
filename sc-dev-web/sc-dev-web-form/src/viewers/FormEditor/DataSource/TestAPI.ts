import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
// @ts-ignore
import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js';
import { generateQuery } from '../../utils/graphql.js';
import { invokeProcessApiRaw, isProcessApiSource } from '../../utils/process-api.js';
import type { ParameterType } from './types.js';
import { directEvaluateCondition } from '../../Components/common/FormEngine.js';
import ScElement from '../../utils/sc-element.js';

import '../CodeViewer.js';

type Parameter = {
  [key: string]: ParameterType
}

type ParameterValue = {
  [key: string]: string
}

type ProcessParameterType = ParameterType & {
  in?: string
}

export default class TestAPI extends ScElement {
  static styles = [
    css`
      .note {
        border-radius: 0.5rem;
        min-height: 2.75rem;
        line-height: 2.75rem;
        background: var(--sc-color-grey-100);
        padding-left: 0.5rem;
        margin-bottom: 1rem;
        display: flex;
      }
      .test-link {
        padding-top: 1rem;
      }
      .sub-title {
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
      }
      .row {
        padding: 0 0 0.937rem 0;
        width: 100%;
        display: block;
        font-size: 0.75rem;
        line-height: 1.9rem;
        color: var(--sc-label-color, var(--sc-color-grey-650));

        &.small {
          padding-bottom: 0.5rem;
        }
        &.no-padding {
          padding: 0;
        }
      }
      .label-text {
        font-size: 0.875rem;
        color: var(--sc-form-control-color, var(--sc-color-blue-900));
      }

    `,
    ScGridStyle,
  ];
  
  @property({ type: String, attribute: 'source-type' }) sourceType = 'api';

  @property({ type: String, attribute: 'api-type' }) apiType = '';

  @property({ type: String }) method = '';

  @property({ type: String }) namespace = '';

  @property({ type: String }) name = '';

  @property({ type: String }) endpoint = '';

  @property({ type: Array }) arguments: ProcessParameterType[];

  @property({ type: Array }) fields: string[];

  @property({ type: Boolean, attribute: 'show-error-message' }) showErrorMessage = false;

  @property({ type: String, attribute: 'error-message-parameter' }) errorMessageParameter = '';

  @state() argumentValues: Parameter = {};

  @state() parameterValues: ParameterValue = {};

  @state() testResult = '';

  @state() response: any = '';

  @state() testing = false;

  get isProcessApiType() {
    return isProcessApiSource({ type: this.sourceType, apiType: this.apiType });
  }

  get query() {
    return generateQuery({
      namespace: this.namespace,
      name: this.name,
      filters: this.argumentValues,
      fields: this.fields,
    });
  }

  updateParameterValues(event: CustomEvent, parameter: ParameterType) {
    this.argumentValues[parameter.value] = {
      value: event.detail.value,
      type: parameter.type,
    };
  }

  updateProcessParameterValues(event: CustomEvent, name: string) {
    this.parameterValues = { ...this.parameterValues, [name]: event.detail.value };
  }

  private filterRemovedArguments() {
    const validArgumentKeys = new Set(
      (this.arguments || [])
        .map(argument => argument?.value)
        .filter((value): value is string => Boolean(value)),
    );

    const filteredArgumentValues = Object.entries(this.argumentValues || {}).reduce((acc, [key, value]) => {
      if (validArgumentKeys.has(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Parameter);

    const filteredParameterValues = Object.entries(this.parameterValues || {}).reduce((acc, [key, value]) => {
      if (validArgumentKeys.has(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as ParameterValue);

    this.argumentValues = filteredArgumentValues;
    this.parameterValues = filteredParameterValues;
  }

  startTesting = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    this.filterRemovedArguments();
    this.testing = true;
    if (this.isProcessApiType) {
      await this.startProcessTesting();
    } else {
      await this.startGraphQLTesting();
    }
  };

  private async startGraphQLTesting() {
    let response;
    try {
      response = await this._graphQLClient?.query(this.query);
    } catch (error) {
      await this.onError(error);
      return;
    }

    if (!response.ok) {
      await this.onError(response);
      return;
    }

    let responseData;
    try {
      const jsonData = await response.json();
      responseData = jsonData.data || jsonData;
      this.onLoad(responseData);
    } catch (error) {
      await this.onError(error);
      return;
    }

    if (!responseData) {
      await this.onError({ message: 'No response' });
      return;
    }

    let errorInfo = responseData['errors'];
    if (errorInfo) {
      if (Array.isArray(errorInfo)) {
        errorInfo = errorInfo[0];
      }
      await this.onError(errorInfo);
    }
  }

  private async startProcessTesting() {
    try {
      const response = await invokeProcessApiRaw(this._restClient, {
        apiNameSpace: this.namespace,
        endpoint: this.endpoint,
        method: this.method || 'POST',
        payload: this.parameterValues,
        apiArguments: this.arguments,
      });
      if (!response?.ok) {
        await this.onError(response);
        return;
      }
      const data = await response.json();
      this.onLoad(data);
    } catch (error) {
      await this.onError(error);
    }
  }

  onLoad(data: any) {
    this.response = data;
    this.testResult = 'Passed';
    this.testing = false;
  }

  private parseErrorByParameter(value: any): string {
    if (!this.errorMessageParameter) {
      return '';
    }

    try {
      const resolved = directEvaluateCondition(this.errorMessageParameter, value);
      if (typeof resolved === 'string') {
        return resolved.trim();
      }
      if (resolved === undefined || resolved === null || typeof resolved === 'boolean') {
        return '';
      }
      return String(resolved).trim();
    } catch (_error) {
      return '';
    }
  }

  private parseTextBody(value: string): any {
    const text = (value || '').trim();
    if (!text) {
      return '';
    }

    try {
      return JSON.parse(text);
    } catch (_error) {
      return text;
    }
  }

  private pickErrorMessage(value: any): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value.trim();
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const message = this.pickErrorMessage(item);
        if (message) {
          return message;
        }
      }
      return '';
    }

    if (typeof value === 'object') {
      const candidates = ['message', 'error', 'detail', 'title', 'error_description'];
      for (const key of candidates) {
        const message = this.pickErrorMessage(value[key]);
        if (message) {
          return message;
        }
      }

      const fallbackErrors = this.pickErrorMessage(value.errors);
      if (fallbackErrors) {
        return fallbackErrors;
      }
    }

    return '';
  }

  private async readStreamAsText(stream: ReadableStream<Uint8Array>): Promise<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let result = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        if (value) {
          result += decoder.decode(value, { stream: true });
        }
      }
      result += decoder.decode();
    } finally {
      reader.releaseLock();
    }

    return result;
  }

  private async resolveFinalErrorMessage(error: any): Promise<string> {
    const directConfigured = this.parseErrorByParameter(error);
    if (directConfigured) {
      return directConfigured;
    }

    const directGeneric = this.pickErrorMessage(error);
    let payload: any = null;
    let rawText = '';

    const streamCandidate =
      (error && error.body && typeof error.body.getReader === 'function' && error.body)
      || (error && error.response && error.response.body
        && typeof error.response.body.getReader === 'function' && error.response.body);

    if (streamCandidate) {
      try {
        rawText = await this.readStreamAsText(streamCandidate as ReadableStream<Uint8Array>);
        payload = this.parseTextBody(rawText);
      } catch (_streamError) {
        // Ignore stream read errors and continue fallback checks.
      }
    } else {
      const responseCandidate = error && typeof error.clone === 'function' ? error.clone() : error;
      if (responseCandidate) {
        try {
          if (typeof responseCandidate.json === 'function') {
            payload = await responseCandidate.json();
          }
        } catch (_jsonError) {
          // Ignore JSON parse errors and fallback to text parsing.
        }

        if (!payload) {
          try {
            if (typeof responseCandidate.text === 'function') {
              rawText = await responseCandidate.text();
              payload = this.parseTextBody(rawText);
            }
          } catch (_textError) {
            // Ignore unreadable body and fallback to direct messages.
          }
        }
      }
    }

    const payloadConfigured = this.parseErrorByParameter(payload);
    if (payloadConfigured) {
      return payloadConfigured;
    }

    const payloadGeneric = this.pickErrorMessage(payload) || this.pickErrorMessage(rawText);
    if (payloadGeneric) {
      return payloadGeneric;
    }

    return directGeneric || '';
  }

  async onError(error: any) {
    const errorMessage = await this.resolveFinalErrorMessage(error);
    this.response = errorMessage || '';

    this.testResult = 'Failed';
    this.testing = false;
  }

  render() {
    return html`
      <div class=sub-title>Test your configuration by providing the necessary input.</div>
      ${this.isProcessApiType ? html`
        <div class=row>
          <sc-label label="Endpoint" label-size="md"></sc-label>
          <span class=label-text>${this.endpoint}</span>
        </div>
      ` : nothing}
      ${
  Array.isArray(this.arguments) && this.arguments.length > 0 && this.arguments[0] ? html`
          <div class="row no-padding">
            <sc-grid-row>
              <sc-grid-column xs="3">
                Parameter
              </sc-grid-column>
              <sc-grid-column xs="9">Value</sc-grid-column>
            </sc-grid-row>
          </div>
          ${
  this.arguments?.map((argument: ParameterType) => {
    return html`
              <div class="row small">
                <sc-grid-row>
                  <sc-grid-column xs="3" class=label-text>
                    ${argument?.value}
                  </sc-grid-column>
                  <sc-grid-column xs="9">
                    ${this.isProcessApiType ? html`
                      <sc-text-input
                        value=${this.parameterValues[argument?.value] || ''}
                        border-type=box
                        @sc-input=${(event: CustomEvent) =>
                          this.updateProcessParameterValues(event, argument?.value)}
                      ></sc-text-input>
                    ` : html`
                      <sc-text-input
                        value=${this.argumentValues[argument?.value]?.value}
                        border-type=box 
                        @sc-input=${(event: CustomEvent) => this.updateParameterValues(event, argument)}
                      ></sc-text-input>
                    `}
                  </sc-grid-column>
                </sc-grid-row>
              </div>
              `;
  })
}
        ` : nothing
}
      <div class="row test-link">
        <sc-button compact no-border
          ?loading=${this.testing} 
          type="link" 
          size="sm" 
          width="auto" 
          left-icon=${!this.testing && 'lab'}
          @click=${this.startTesting}
        >
          ${ this.testing ? 'Connecting...' : 'Test connection' }
        </sc-button>
      </div>
      ${
        this.testResult === 'Passed' ? html`
          <sc-alert type="success" mode="banner" open>  
            <div slot="title">
              <sc-icon name="checkmark-circle--line" size="sm"></sc-icon> ${this.testResult}
            </div>  
          </sc-alert>
        ` : this.testResult === 'Failed' ? html`
          <sc-alert type="error" mode="banner" open>  
            <div slot="title">
              <sc-icon name="alert-circle--line" size="sm"></sc-icon> ${this.testResult}
            </div>  
          </sc-alert>
        ` : nothing
      }
      ${
        this.response && this.testResult === 'Failed' ? html`
          <div class=row>
            ${this.response}
          </div>
        ` : this.response ? html`
          <div class=row>
            <code-viewer editable no-padding codeSinppets=${JSON.stringify(this.response)}></code-viewer>
          </div>
        ` : nothing
}
      
      
    `;
  }
}


if (!window.customElements.get('test-api')) {
  window.customElements.define('test-api', TestAPI);
}