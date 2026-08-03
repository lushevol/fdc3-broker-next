import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAvailableComponent } from '../../components/not-available/not-available.component';
import { User } from './user';
import { Service } from './service';
import { Setting } from './setting';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, NotAvailableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  readonly imagePath = '../../assets/services';

  bannerIcon: string = `${this.imagePath}/house-view.png`;
  appSettingIcon: string = `${this.imagePath}/app-settings.svg`;
  atmIcon: string = `${this.imagePath}/atm.svg`;
  commSettingIcon: string = `${this.imagePath}/comm-settings.svg`;
  creditCardActivationIcon: string = `${this.imagePath}/credit-card-activate.svg`;
  creditCardReportIcon: string = `${this.imagePath}/credit-card-report.svg`;
  languageIcon: string = `${this.imagePath}/language.svg`;
  overseasUseIcon: string = `${this.imagePath}/overseas-use.svg`;
  passwordSecurityIcon: string = `${this.imagePath}/password-security.svg`;
  payTransferIcon: string = `${this.imagePath}/pay-transfer.svg`;
  personalDetailsIcon: string = `${this.imagePath}/personal-details.svg`;
  sgFinDexIcon: string = `${this.imagePath}/SGFinDex.svg`;
  aboutIcon: string = `${this.imagePath}/about.svg`;
  eStatementsIcon: string = `${this.imagePath}/e-statements.svg`;
  faqIcon: string = `${this.imagePath}/faq.svg`;

  user: User = {
    name: 'JOHN SMITH',
    type: 'Priority Banking',
    lastLogin: 'Thus, 25 jan 2024, 11:56 am',
  };

  services: Service[] = [
    {
      title: 'Report Lost/Stolen Card',
      icon: this.creditCardReportIcon,
    },
    {
      title: 'Debit/ATM Card Activation',
      icon: this.atmIcon,
    },
    {
      title: 'Credit Card Activation & PIN Setup',
      icon: this.creditCardActivationIcon,
    },
    {
      title: 'Overseas Card Usage',
      icon: this.overseasUseIcon,
    },
  ];

  additionalServices: Service[] = [
    {
      title: 'Personal Details',
      copy: 'Edit Personal Details',
      icon: this.personalDetailsIcon,
    },
    {
      title: 'Manage SGFinDex',
      copy: 'Consolidated Financial View',
      icon: this.sgFinDexIcon,
    },
  ];

  settings: Setting[] = [
    {
      title: 'Settings & Configuration',
      options: [
        {
          title: 'Password and Security Settings',
          icon: this.passwordSecurityIcon,
        },
        {
          title: 'Pay & Transfer Settings',
          icon: this.payTransferIcon,
        },
        {
          title: 'Communication Settings',
          icon: this.commSettingIcon,
        },
        {
          title: 'App Settings',
          icon: this.appSettingIcon,
        },
        {
          title: 'Language / 语言',
          icon: this.languageIcon,
        },
      ],
    },
    {
      title: 'Statements & Documents',
      options: [
        {
          title: 'View eStatements',
          icon: this.eStatementsIcon,
        },
      ],
    },
    {
      title: 'Useful Links',
      options: [
        {
          title: 'FAQs',
          copy: 'Self help on frequently asked questions.',
          icon: this.faqIcon,
        },
        {
          title: 'About',
          icon: this.aboutIcon,
        },
      ],
    },
  ];

  showSideSheet: boolean = false;

  handleShowSideSheet(isShow: boolean): void {
    this.showSideSheet = isShow;
  }
}
