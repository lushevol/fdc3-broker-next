import { CUSTOM_COMPONENT } from '../types.js';

export const CustomComponentsList: CUSTOM_COMPONENT[] = [
  {
    label: 'World Clock',
    id: 'world-clock',
    icon: 'clock--line',
    name: 'sb-widget-world-clock',
    path: '/sb-widget/55313-sb-widget-main/elements/world-clock.js',
  }, {
    label: 'Page Banner',
    id: 'page-banner',
    icon: 'layout--line',
    name: 'sb-widget-page-banner',
    path: '/sb-widget/55313-sb-widget-main/elements/page-banner.js',
  }, {
    label: 'My actions',
    id: 'my-actions',
    icon: 'checkmark-circle--line',
    name: 'sb-widget-my-actions',
    path: '/sb-widget/55313-sb-widget-main/elements/my-actions.js',
  },  
  {
    label: 'Diagnosis',
    id: 'diagnosis',
    icon: 'diagnostics',
    name: 'sb-diagnosis-home',
    path: '/sb-app/55313-sb-plugin-diagnosis/elements/home.js',
  },
];