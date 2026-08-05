import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { ScTimeInput } from '../../ScTimeInput/ScTimeInput.js';
import ScTimeInputStyle from '../../ScTimeInput/ScTimeInput.style.js';
import ScTheme from '../../../styles/ScTheme.js';
import { datePickerStyling } from '../DatePicker/ScDatePicker.style.js';
import ScDateSelectTimeStyle from './ScDateSelectTime.style.js';

export class ScDateSelectTime extends ScTimeInput {

    static styles = ScTheme.getStyles().concat([
        ScTimeInputStyle,
        datePickerStyling,
        ScDateSelectTimeStyle,
    ]);

    @property({ type: String, attribute: 'confirm-label' }) public confirmLabel = msg('Confirm', { id: 'sc-date-select-time-confirm' });

    private selectTime() {
        this.emit('sc-select', {
            detail: {
                value: this.value,
            },
        });
    }

    getCustomTypesMapping() {
        return {
            hour: 'Hour',
            minute: 'Minute',
            second: 'Second',
        };
    }

    override render() {
        return html`
        <div class="sc-time-input">
            ${this.renderTimeSelector()}
            <div class="action-bar">
              <sc-button
                @click=${this.selectTime}
                type="link"
                size="xxs"
                width="100%"
                no-pill="true"
              >
                ${this.confirmLabel}
              </sc-button>
            </div>
        </div>
        `;
    }
}
