import { useState } from 'react';
import TypographyShowcase from './components/TypographyShowcase';
import ColorShowcase from './components/ColorShowcase';
import ButtonShowcase from './components/ButtonShowcase';
import BadgeShowcase from './components/BadgeShowcase';
import CardShowcase from './components/CardShowcase';
import CheckboxShowcase from './components/CheckboxShowcase';
import AccordionShowcase from './components/AccordionShowcase';
import AvatarShowcase from './components/AvatarShowcase';
import ActionBarShowcase from './components/ActionBarShowcase';
import AlertBannerShowcase from './components/AlertBannerShowcase';
import FileUploaderShowcase from './components/FileUploaderShowcase';
import ListShowcase from './components/ListShowcase';
import DatePickerShowcase from './components/DatePickerShowcase';
import DropdownInputShowcase from './components/DropdownInputShowcase';
import ButtonSegmentShowcase from './components/ButtonSegmentShowcase';
import DropdownMenuShowcase from './components/DropdownMenuShowcase';
import AnchorNavigationShowcase from './components/AnchorNavigationShowcase';
import SwitchShowcase from './components/SwitchShowcase';
import RadioShowcase from './components/RadioShowcase';
import TextInputShowcase from './components/TextInputShowcase';
import ModalShowcase from './components/ModalShowcase';
import TabsShowcase from './components/TabsShowcase';
import ToastShowcase from './components/ToastShowcase';
import PaginationShowcase from './components/PaginationShowcase';
import NumberInputShowcase from './components/NumberInputShowcase';
import OTPPinInputShowcase from './components/OTPPinInputShowcase';
import ProgressIndicatorShowcase from './components/ProgressIndicatorShowcase';
import RatingShowcase from './components/RatingShowcase';
import SearchInputShowcase from './components/SearchInputShowcase';
import TimeInputShowcase from './components/TimeInputShowcase';
import BreadcrumbsShowcase from './components/BreadcrumbsShowcase';
import SliderShowcase from './components/SliderShowcase';
import StepperShowcase from './components/StepperShowcase';
import StagesShowcase from './components/StagesShowcase';
import StatusShowcase from './components/StatusShowcase';
import PopoverShowcase from './components/PopoverShowcase';
import PageHeaderShowcase from './components/PageHeaderShowcase';
import SidePanelNavigationShowcase from './components/SidePanelNavigationShowcase';
import RichTextEditorShowcase from './components/RichTextEditorShowcase';

export default function App() {
  const [activeSection, setActiveSection] = useState('typography');

  const sections = [
    { id: 'typography', label: 'Typography' },
    { id: 'colors', label: 'Colours' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'badges', label: 'Badges' },
    { id: 'cards', label: 'Cards' },
    { id: 'checkboxes', label: 'Checkboxes' },
    { id: 'accordions', label: 'Accordions' },
    { id: 'avatars', label: 'Avatars' },
    { id: 'action-bars', label: 'Action bars' },
    { id: 'alert-banners', label: 'Alert banners' },
    { id: 'file-uploaders', label: 'File uploaders' },
    { id: 'lists', label: 'Lists' },
    { id: 'date-pickers', label: 'Date pickers' },
    { id: 'dropdown-inputs', label: 'Dropdown inputs' },
    { id: 'dropdown-menus', label: 'Dropdown menus' },
    { id: 'button-segments', label: 'Button segments' },
    { id: 'anchor-navigation', label: 'Anchor navigation' },
    { id: 'switches', label: 'Switches' },
    { id: 'radios', label: 'Radios' },
    { id: 'text-inputs', label: 'Text inputs' },
    { id: 'modals', label: 'Modals' },
    { id: 'tabs', label: 'Tabs' },
    { id: 'toast', label: 'Toast' },
    { id: 'pagination', label: 'Pagination' },
    { id: 'number-inputs', label: 'Number inputs' },
    { id: 'otp-pin-inputs', label: 'OTP/PIN inputs' },
    { id: 'progress-indicators', label: 'Progress indicators' },
    { id: 'ratings', label: 'Ratings' },
    { id: 'search-inputs', label: 'Search inputs' },
    { id: 'time-inputs', label: 'Time inputs' },
    { id: 'breadcrumbs', label: 'Breadcrumbs' },
    { id: 'sliders', label: 'Sliders' },
    { id: 'steppers', label: 'Steppers' },
    { id: 'stages', label: 'Stages' },
    { id: 'statuses', label: 'Statuses' },
    { id: 'popovers', label: 'Popovers' },
    { id: 'page-headers', label: 'Page headers' },
    { id: 'side-panel-navigation', label: 'Side panel navigation' },
    { id: 'rich-text-editors', label: 'Rich text editors' },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--sc-color-foundation-basic-background-base)',
        color: 'var(--sc-color-foundation-content-body)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor:
            'var(--sc-color-foundation-basic-brand-prosper-blue)',
          color: 'var(--sc-color-foundation-basic-brand-prosper-blue-inverse)',
          borderBottom:
            '1px solid var(--sc-color-foundation-basic-divider-base)',
          flexShrink: 0,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1
            style={{
              fontSize: 'var(--sc-text-section-main)',
              lineHeight: '44px',
              margin: 0,
            }}
          >
            Global Design System showcase
          </h1>
          <p
            style={{
              fontSize: 'var(--sc-text-paragraph-main)',
              lineHeight: '22px',
              marginTop: '8px',
              opacity: 0.9,
            }}
          >
            Standard Chartered design system components and tokens
          </p>
        </div>
      </header>

      <div
        className="flex max-w-7xl mx-auto"
        style={{
          flex: 1,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Sidebar Navigation */}
        <aside
          className="w-64 shrink-0"
          style={{
            borderRight:
              '1px solid var(--sc-color-foundation-basic-divider-base)',
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100%',
          }}
        >
          <nav className="p-6">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {sections.map((section) => (
                <li key={section.id} style={{ marginBottom: '4px' }}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '5px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: 'var(--sc-text-component-main)',
                      lineHeight: '22px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor:
                        activeSection === section.id
                          ? 'var(--sc-color-blue-50)'
                          : 'transparent',
                      color:
                        activeSection === section.id
                          ? 'var(--sc-color-blue-600)'
                          : 'var(--sc-color-foundation-content-body)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== section.id) {
                        e.currentTarget.style.backgroundColor =
                          'var(--sc-color-grey-50)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== section.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            height: '100%',
            padding: '32px',
            backgroundColor: 'var(--sc-color-foundation-basic-container-base)',
          }}
        >
          {activeSection === 'typography' && <TypographyShowcase />}
          {activeSection === 'colors' && <ColorShowcase />}
          {activeSection === 'buttons' && <ButtonShowcase />}
          {activeSection === 'badges' && <BadgeShowcase />}
          {activeSection === 'cards' && <CardShowcase />}
          {activeSection === 'checkboxes' && <CheckboxShowcase />}
          {activeSection === 'accordions' && <AccordionShowcase />}
          {activeSection === 'avatars' && <AvatarShowcase />}
          {activeSection === 'action-bars' && <ActionBarShowcase />}
          {activeSection === 'alert-banners' && <AlertBannerShowcase />}
          {activeSection === 'file-uploaders' && <FileUploaderShowcase />}
          {activeSection === 'lists' && <ListShowcase />}
          {activeSection === 'date-pickers' && <DatePickerShowcase />}
          {activeSection === 'dropdown-inputs' && <DropdownInputShowcase />}
          {activeSection === 'dropdown-menus' && <DropdownMenuShowcase />}
          {activeSection === 'button-segments' && <ButtonSegmentShowcase />}
          {activeSection === 'anchor-navigation' && (
            <AnchorNavigationShowcase />
          )}
          {activeSection === 'switches' && <SwitchShowcase />}
          {activeSection === 'radios' && <RadioShowcase />}
          {activeSection === 'text-inputs' && <TextInputShowcase />}
          {activeSection === 'modals' && <ModalShowcase />}
          {activeSection === 'tabs' && <TabsShowcase />}
          {activeSection === 'toast' && <ToastShowcase />}
          {activeSection === 'pagination' && <PaginationShowcase />}
          {activeSection === 'number-inputs' && <NumberInputShowcase />}
          {activeSection === 'otp-pin-inputs' && <OTPPinInputShowcase />}
          {activeSection === 'progress-indicators' && (
            <ProgressIndicatorShowcase />
          )}
          {activeSection === 'ratings' && <RatingShowcase />}
          {activeSection === 'search-inputs' && <SearchInputShowcase />}
          {activeSection === 'time-inputs' && <TimeInputShowcase />}
          {activeSection === 'breadcrumbs' && <BreadcrumbsShowcase />}
          {activeSection === 'sliders' && <SliderShowcase />}
          {activeSection === 'steppers' && <StepperShowcase />}
          {activeSection === 'stages' && <StagesShowcase />}
          {activeSection === 'statuses' && <StatusShowcase />}
          {activeSection === 'popovers' && <PopoverShowcase />}
          {activeSection === 'page-headers' && <PageHeaderShowcase />}
          {activeSection === 'side-panel-navigation' && (
            <SidePanelNavigationShowcase />
          )}
          {activeSection === 'rich-text-editors' && <RichTextEditorShowcase />}
        </main>
      </div>
    </div>
  );
}
