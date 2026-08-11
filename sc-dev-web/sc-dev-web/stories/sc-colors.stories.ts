import { html, TemplateResult } from 'lit';
import BasicDefinitions from '../src/styles/ScBasicDefinitions.js';

export default {
  title: 'Colors/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'All colors.',
      },
    },
  },
};

interface Story {
  (): TemplateResult;
}

const ColorListTemplate = () =>
  html`
  <style>
    .color-container {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .color-text {
      min-width: 350px;
    }
    .color-item {
      width: 40px;
      height: 20px;
      border: 1px solid #000;
    }
  </style>
  <div>
    ${Object.keys(BasicDefinitions.colorMapping).map((color: string) => {
    //@ts-ignore
    const colorValue = BasicDefinitions.colorMapping[color];
    return html`
        <div class='color-container'>
          <div class='color-text'>${color}</div>
          <div class='color-text'>${colorValue}</div>
          <div class='color-item' style="background-color: var(${color}, ${colorValue})"></div>
        </div>
      `;
  })}
  </div>
  `;

const AllIconsTemplate: Story = () => ColorListTemplate();
export const All = AllIconsTemplate.bind({});
