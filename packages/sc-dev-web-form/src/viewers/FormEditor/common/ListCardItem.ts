import { html } from 'lit';
import { MoreActions } from './MoreActions.js';

export const ListCardItem = (icon: string, title: string, moreActions: any[], type?: string) => {
  const isAPI = type === 'api';
  return html`
    <style>
      sc-card {
        --sc-card-background-color: transparent;
      }
      
      .title-container {
        display: flex;
        font-weight: normal;
      }

      .title-container sc-icon {
        margin-right: 1rem;
      }

      .more-action {
        position: absolute;
        top: 0.562rem;
        right: 0.875rem;
      }

    </style>
    <sc-card 
      clickable
      .hoverHighlight=${true}
      .tagsGroup=${[
        { 
          type: isAPI ? 'primary' : 'success',
          content: isAPI ? 'API' : 'Excel',
        },
      ]}
      space-size=xs style='--sc-card-border-radius: 0.375rem'>
      <div slot="title">
        <div class='title-container'>
          <sc-icon size=md name=${icon}></sc-icon>
          <span>${title}</span>
        </div>
        ${
  MoreActions(moreActions)
}
      </div>
    </sc-card>`;
};