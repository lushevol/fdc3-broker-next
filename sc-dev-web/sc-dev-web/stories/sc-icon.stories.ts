import { html, TemplateResult } from 'lit';
import { CountryIconLibrary, MainIconLibrary } from '@scdevkit/icons';
// @ts-ignore
window.CountryIconLibrary = CountryIconLibrary;
// @ts-ignore
window.MainIconLibrary = MainIconLibrary;

export default {
  title: 'Components/Icon',
  component: 'sc-icon',
  parameters: {
    docs: {
      description: {
        component:
          'Icons are symbols that can be used to represent various options within an application. ' +
          'It will search system icons by default. ' +
          'If you prefer, you can provide more custom icon libraries by sc-icon-provider.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'The name of the icon. Refer to icon library for complete list of available icons.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    label: {
      control: 'text',
      description: 'An alternate description to use for assistive devices. ' +
        'If omitted, the icon will be considered presentational and ignored by assistive devices.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'The preferred size of the icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    library: {
      control: 'text',
      description: 'The name of a registered icon library. ' +
        'If no specified library, will search all registered libraries.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
  },
  args: {
    name: '',
    label: '',
    size: 'sm',
    library: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  name: string,
  label?: string,
  size?: string;
  library?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html` 
    <sc-icon 
      name=${props.name} 
      label=${props.label}
      size=${props.size}
      library=${props.library}
    ></sc-icon>
  `;

const SizeTemplate: Story<ArgTypes> = (props: ArgTypes) =>
  html` 
    <sc-icon 
      name=${props.name} 
      size='xxs'
    ></sc-icon>
    <sc-icon 
      name=${props.name} 
      size='xs'
    ></sc-icon>
    <sc-icon 
      name=${props.name} 
      size='sm'
    ></sc-icon>
    <sc-icon 
      name=${props.name} 
      size='md'
    ></sc-icon>
    <sc-icon 
      name=${props.name} 
      size='lg'
    ></sc-icon>
    <sc-icon 
      name=${props.name} 
      size='xl'
    ></sc-icon>
    <sc-icon 
      name=${props.name} 
      size='xxl'
    ></sc-icon>
  `;

export const Default = Template.bind({});
Default.args = {
  size: 'sm',
  name: 'clock--line',
};

export const Size = SizeTemplate.bind({});
Size.args = {
  name: 'clock--line',
};

const IconLibraryTemplate: Story<ArgTypes> = ({
  name = '',
  library = '',
}: ArgTypes) => html` 
  <sc-icon-provider id='sc-icon-provider'>
    <sc-icon name=${name} size="xxs" library=${library}> </sc-icon>
    <sc-icon name=${name} size="xs" library=${library}> </sc-icon>
    <sc-icon name=${name} size="sm" library=${library}> </sc-icon>
    <sc-icon name=${name} size="md" library=${library}> </sc-icon>
    <sc-icon name=${name} size="lg" library=${library}> </sc-icon>
    <sc-icon name=${name} size="xl" library=${library}> </sc-icon>
    <sc-icon name=${name} size="xxl" library=${library}> </sc-icon>
  </sc-icon-provider>
  <script type="module">
    // import { CountryIconLibrary, MainIconLibrary } from '@scdevkit/icons';
    document.getElementById('sc-icon-provider').iconLibraries = [
      window.MainIconLibrary, window.CountryIconLibrary
    ];
  </script>
`;

export const ScIconLibrary = IconLibraryTemplate.bind({});
ScIconLibrary.args = {
  name: 'country-deu',
};


const CustomLibraryTemplate: Story<ArgTypes> = ({
  name = '',
  library = '',
}: ArgTypes) => html` 
  <sc-icon-provider id='custom-icon-provider'>
    <sc-icon name=${name} size="xxs" library=${library}> </sc-icon>
    <sc-icon name=${name} size="xs" library=${library}> </sc-icon>
    <sc-icon name=${name} size="sm" library=${library}> </sc-icon>
    <sc-icon name=${name} size="md" library=${library}> </sc-icon>
    <sc-icon name=${name} size="lg" library=${library}> </sc-icon>
    <sc-icon name=${name} size="xl" library=${library}> </sc-icon>
    <sc-icon name=${name} size="xxl" library=${library}> </sc-icon>
  </sc-icon-provider>
  <script type="module">
    const CustomIcons = {
      'film': \`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M25.7378 2H6.26222V2C3.90826 2 2 3.90826 2 
        6.26222V6.26222V25.7378V25.7378C2 28.0917 3.90826 30 6.26222 30H25.7378V30C28.0917 30 30 28.0917 30 
        25.7378V6.26222V6.26222C30 3.90826 28.0917 2 25.7378 2V2ZM8.22223 
        14.4444H5.11112V11.3333H8.22223V14.4444ZM5.11112 17.5555H8.22223V20.6666H5.11112V17.5555ZM11.3333 
        5.11115H20.6667V26.8889H11.3333V5.11115ZM26.8889 14.4444H23.7778V11.3333H26.8889V14.4444ZM23.7778 
        17.5555H26.8889V20.6666H23.7778V17.5555ZM26.8889 6.26226V8.22226H23.7778V5.11115H25.7378V5.11115C26.3735 
        5.11115 26.8889 5.62652 26.8889 6.26226V6.26226ZM6.26223 
        5.11115H8.22223V8.22226H5.11112V6.26226V6.26226C5.11112 5.62652 5.62649 5.11115 6.26223 
        5.11115V5.11115ZM5.11112 25.7378V23.7778H8.22223V26.8889H6.26223V26.8889C5.62649 26.8889 5.11112 26.3736 
        5.11112 25.7378H5.11112ZM26.8889 25.7378V25.7378C26.8889 26.3736 26.3735 26.8889 25.7378 
        26.8889H23.7778V23.7778H26.8889V25.7378Z" fill="currentColor"/>
        </svg>
      \`,
      'music': \`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_20132_35)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M30.027 21.3505V1.78334V1.78335C30.0245 1.2421 29.7757 
        0.731434 29.351 0.395861V0.395861C28.9325 0.0572643 28.3831 -0.0735456 27.8568 0.040095L11.8474 
        3.59776V3.59776C11.0332 3.78137 10.4561 4.50637 10.4599 5.34101V20.1765V20.1765C7.35936 18.7127 3.65932 20.0396 
        2.19559 23.1401C0.731866 26.2406 2.05874 29.9407 5.15925 31.4044C8.25975 32.8681 11.9598 31.5412 13.4235 
        28.4407C13.8086 27.625 14.0113 26.7352 14.0175 25.8331V25.8331C14.0359 25.5251 14.0359 25.2162 14.0175 
        24.9081V6.76407L26.4693 4.00688V16.6188H26.4693C23.3689 15.155 19.6688 16.4818 18.205 19.5823C16.7412 22.6828 
        18.068 26.3828 21.1685 27.8466C24.269 29.3104 27.9691 27.9836 29.4329 24.8831C29.8205 24.062 30.0234 23.1658 
        30.027 22.2577V22.2577C30.0439 21.9555 30.0439 21.6526 30.027 21.3505L30.027 21.3505ZM7.86288 
        28.4657V28.4657C6.39907 28.4652 5.21283 27.2782 5.21333 25.8144C5.21383 24.3506 6.40089 23.1643 7.86469 
        23.1648C9.12246 23.1653 10.2067 24.0496 10.46 25.2816V25.2816C10.4774 25.4591 10.4774 25.6378 10.46 
        25.8153V25.8158C10.46 27.259 9.30525 28.437 7.86232 28.4657L7.86288 28.4657ZM23.8727 24.908V24.908C22.3992 
        24.9195 21.1953 23.7342 21.1838 22.2607C21.1723 20.7871 22.3576 19.5832 23.8311 19.5717C25.1136 19.5617 26.2218 
        20.4656 26.4698 21.7239V21.7239C26.4873 21.9014 26.4873 22.0801 26.4698 22.2576V22.2576C26.4601 23.7173 25.2791 
        24.8983 23.8194 24.908L23.8727 24.908Z" fill="currentColor"/>
        </g>
        <defs>
        <clipPath id="clip0_20132_35">
        <rect width="32" height="32" fill="white"/>
        </clipPath>
        </defs>
        </svg>
      \`,
    };
    const CustomIconLibrary = {
      name: 'custom-lib-name', // custom icon library name
      resolver: (name) => { // function to return icon data based on name
        if (name in CustomIcons) {
            return 'data:image/svg+xml,' + encodeURIComponent(CustomIcons[name]);
        }
        return '';
      }
    };
    
    document.getElementById('custom-icon-provider').iconLibraries = [
      CustomIconLibrary
    ];
  </script>
`;

export const CustomLibrary = CustomLibraryTemplate.bind({});
CustomLibrary.args = {
  name: 'film',
  library: 'custom-lib-name',
};
