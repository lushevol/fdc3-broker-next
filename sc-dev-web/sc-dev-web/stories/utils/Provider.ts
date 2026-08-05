import { html } from 'lit';
import '../providers/ScDataProvider.js';
import { CountryIconLibrary, MainIconLibrary } from '@scdevkit/icons';

export const Provider = (child: any) => {
  return html`
    <sc-demo-data-provider>
      <sc-icon-provider .iconLibraries=${[CountryIconLibrary, MainIconLibrary]}>
        ${child}
      </sc-icon-provider>
    </sc-demo-data-provider>
  `;
};