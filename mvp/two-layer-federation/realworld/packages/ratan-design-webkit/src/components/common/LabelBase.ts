import ScElement from '../../shared/sc-element.js';
import { property } from 'lit/decorators.js';
import { POSITION, LABEL_ALIGN, TEXT_SIZE } from '../../shared/util.js';

export class LabelBase extends ScElement {
  @property({ type: Boolean }) required = false;

  @property({ type: String }) label = '';

  @property({ type: LABEL_ALIGN, attribute: 'label-alignment' }) labelAlignment = LABEL_ALIGN.left;

  @property({ type: String }) tooltip = '';

  @property({ type: String }) hint = '';

  @property({ attribute: 'tooltip-placement' }) tooltipPlacement: `${POSITION}` = POSITION.top;
  
  @property({ attribute: 'hint-placement' }) hintPlacement: `${POSITION}` = POSITION.right;

  @property({ attribute: 'label-size' }) labelSize: `${TEXT_SIZE}` = TEXT_SIZE.md;

  @property({ type: Boolean }) trustpoint = false;

  @property({ type: Boolean }) truncate = false;
}
