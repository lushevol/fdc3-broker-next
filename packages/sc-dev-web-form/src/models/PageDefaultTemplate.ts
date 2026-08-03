export const CoverPageTemplate = {
  layout: {
    row: '6b345b25-f0ff-40fc-8366-f0cc2ed9e632',
  },
  id: '7eb3312c-f4fc-4ca4-8b6c-d7e23c285148',
  type: 'cover-page',
  name: 'Cover page',
  components: [
    {
      layout: {
        row: '95d03153-6d48-4c8f-81ff-14345a36aedf',
      },
      type: 'image',
      template: {
        src: 'https://servicebench-dev.global.standardchartered.com/sc-webkit/storybook/images/illustration.png',
        width: '50%',
      },
      customized: true,
      id: 'image_cgi6s3',
      alignment: 'center',
    },
    {
      layout: {
        row: 'c82137b3-5fab-43c9-a4a8-d76eb97b8494',
      },
      type: 'banner',
      template: {
        label: 'Welcome to the page',
        body: 'Click \'Next\' button to view the form',
        titleSize: 'xl',
        bodySize: 'xs',
        spaceSize: 'md',
        backgroundColor: 'light-blue',
        textAlignment: 'center',
        imagePosition: 'right',
        imageSrc: '',
        trustpoint: true,
      },
      id: 'banner_qyzips',
      customized: true,
    },
    {
      layout: {
        row: 'd60170c2-1dd2-4449-ba80-963f4f51aba6',
      },
      type: 'spacer',
      template: {
        vertical: true,
        size: '20',
      },
      id: 'spacer_cgq15n',
    },
    {
      layout: {
        row: '1743e440-21e9-4afe-af33-3ccfd740f582',
      },
      type: 'button',
      template: {
        label: 'Next',
        action: 'next',
      },
      id: 'Button_qz3w3v',
      alignment: 'center',
      undeletable: true,
    },
  ],
};

export const ConfirmationPageTemplate = {
  layout: {
    row: 'b58ef4c1-ccf3-468c-9c8c-4859495824fd',
  },
  id: '3c92e652-2674-4f2c-91e8-674044fb2193',
  type: 'confirmation-page',
  name: 'Confirmation page',
  components: [
    {
      layout: {
        row: 'c82137b3-5fab-43c9-a4a8-d76eb97b8494',
      },
      type: 'banner',
      template: {
        label: 'Submitted!',
        body: 'Click \'Next\' button to view the form',
        titleSize: 'xl',
        bodySize: 'xs',
        spaceSize: 'md',
        backgroundColor: 'light-blue',
        textAlignment: 'center',
        imagePosition: 'right',
        imageSrc: '',
        trustpoint: true,
      },
      id: 'banner_qyzips',
      customized: true,
    },
    {
      layout: {
        row: '964de2cd-b53e-4d83-824f-7dac605c96a7',
      },
      type: 'spacer',
      template: {
        vertical: true,
        size: '20',
      },
      id: 'spacer_ciw6tb',
    },
    {
      layout: {
        row: '1743e440-21e9-4afe-af33-3ccfd740f582',
      },
      type: 'button',
      template: {
        label: 'Go to detail',
      },
      id: 'Button_qz3w3v',
      alignment: 'center',
    },
  ],
};