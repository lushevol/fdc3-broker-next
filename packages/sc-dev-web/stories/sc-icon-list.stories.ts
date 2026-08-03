import { html, TemplateResult } from 'lit';
import { Icons as FileIconsMap } from '../src/assets/icons/FileIconLibrary.js';
import { Icons as SystemIconsMap } from '../src/assets/icons/SystemIconLibrary.js';
// @ts-ignore
import { MainIconLibrary, Icons as MainIconsMap } from '@scdevkit/icons/libraries/MainIconLibrary.js';
// @ts-ignore
import { CountryIconLibrary, Icons as CountryIconsMap } from '@scdevkit/icons/libraries/CountryIconLibrary.js';

// @ts-ignore
window.MainIconLibrary = MainIconLibrary;
// @ts-ignore
window.CountryIconLibrary = CountryIconLibrary;

export default {
  title: 'Icons/Icons',
  parameters: {
    docs: {
      description: {
        component:
          'All icons.',
      },
    },
  },
};

interface Story {
  (): TemplateResult;
}

const IconListTemplate = (iconList: object) =>
  html`
  <style>
    .library-container {
      display: grid;
      grid-gap: 32px 16px;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    }
    .icon-element {
      text-align: center;
    }
    .icon-text {
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  </style>
  <sc-icon-provider>
    <div class='library-container'>
      ${Object.keys(iconList).map(item => html`
        <div title=${item} class='icon-element'>
          <sc-icon 
            name=${item}
            size='md'
          ></sc-icon>
          <div class='icon-text'>${item}</div>
        </div>
      `)}
    </div>
  </sc-icon-provider>
  <script type="module">
    document.getElementsByTagName('sc-icon-provider')[0].iconLibraries = [
      window.MainIconLibrary, window.CountryIconLibrary
    ];
  </script>
  `;

const AllIconsTemplate: Story = () => IconListTemplate({
  ...SystemIconsMap, ...FileIconsMap, ...MainIconsMap, ...CountryIconsMap,
});
export const All = AllIconsTemplate.bind({});

const SystemIconsTemplate: Story = () => IconListTemplate(SystemIconsMap);
export const System = SystemIconsTemplate.bind({});

const FileIconsTemplate: Story = () => IconListTemplate(FileIconsMap);
export const File = FileIconsTemplate.bind({});

const MainIconsTemplate: Story = () => IconListTemplate(MainIconsMap);
export const Main = MainIconsTemplate.bind({});

const CountryIconsTemplate: Story = () => IconListTemplate(CountryIconsMap);
export const Country = CountryIconsTemplate.bind({});
