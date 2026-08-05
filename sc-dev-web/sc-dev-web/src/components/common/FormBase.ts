import { property } from 'lit/decorators.js';
import { LabelBase } from './LabelBase.js';

export class FormBase extends LabelBase {
  
  @property({ type: String }) placeholder = 'Input here';
  
  @property({ attribute: 'help-text' }) helpText = '';

  @property({ type: Boolean }) readonly = false;

  @property({ type: Boolean }) disabled = false;

  @property({ type: Boolean }) success = false;

  @property({ type: Boolean }) error = false;

  @property({ type: String, attribute: 'error-message' }) errorMessage = '';

  @property({ type: String, attribute: 'success-message' }) successMessage = '';  
  
  @property({ type: Boolean, attribute: 'max-rows' }) maxRows = false;
  
  @property({ type: Number, attribute: 'readonly-rows' }) readonlyRows = 5;
}
