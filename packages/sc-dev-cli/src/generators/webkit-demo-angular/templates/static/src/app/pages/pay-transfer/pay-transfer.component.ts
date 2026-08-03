import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAvailableComponent } from '../../components/not-available/not-available.component';
import { SwipablePanelComponent } from '../../components/swipable-panel/swipable-panel.component';
import { ImageButtonComponent } from '../../components/image-button/image-button.component';
import { PayTransferType } from './pay-transfer-type';
import { QuickLink } from './quick-link';
import { Option } from './option';
import { Filter } from './filter';
import { Payee } from './payee';

@Component({
  selector: 'app-pay-transfer',
  standalone: true,
  imports: [
    CommonModule,
    NotAvailableComponent,
    SwipablePanelComponent,
    ImageButtonComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pay-transfer.component.html',
  styleUrl: './pay-transfer.component.css',
})
export class PayTransferComponent {
  readonly imagePath = '../../assets/pay-transfer';

  accountIcon: string = `${this.imagePath}/account.svg`;
  betweenMyAccountIcon: string = `${this.imagePath}/between-my-accounts.svg`;
  angBaoIcon: string = `${this.imagePath}/eangbao-sparkle.svg`;
  localTransferIcon: string = `${this.imagePath}/transfer.svg`;
  intXferIcon: string = `${this.imagePath}/int-xfer.svg`;
  scanPayIcon: string = `${this.imagePath}/scan-pay.svg`;
  creditCardIcon: string = `${this.imagePath}/credit-card.svg`;
  payBillIcon: string = `${this.imagePath}/pay-transfer.svg`;
  addPayeeIcon: string = `${this.imagePath}/add-payee.svg`;

  payTransfer: PayTransferType[] = [
    {
      title: 'Between My Accounts',
      icon: this.betweenMyAccountIcon,
    },
    {
      title: 'eAng Bao (PayNow)',
      icon: this.angBaoIcon,
    },
    {
      title: 'Local Transfer',
      icon: this.localTransferIcon,
    },
    {
      title: 'International Transfer',
      icon: this.intXferIcon,
    },
  ];

  quickLinks: QuickLink[] = [
    {
      title: 'Scan & Pay',
      icon: this.scanPayIcon,
    },
    {
      title: 'Pay Credit Cards',
      icon: this.creditCardIcon,
    },
    {
      title: 'Pay Bills',
      icon: this.payBillIcon,
    },
    {
      title: 'Add Payees',
      icon: this.addPayeeIcon,
    },
  ];

  listOptions: Option[] = [
    {
      id: 'myPayees',
      title: 'My Payees',
    },
    {
      id: 'transactions',
      title: 'Transactions',
    },
    {
      id: 'scheduled',
      title: 'Scheduled',
    },
    {
      id: 'manage',
      title: 'Manage',
    },
  ];

  payeeFilters: Filter[] = [
    {
      id: 'all',
      title: 'All',
    },
    {
      id: 'paynow',
      title: 'PayNow',
    },
    {
      id: 'local',
      title: 'Local',
    },
    {
      id: 'international',
      title: 'International',
    },
    {
      id: 'biller',
      title: 'Biller',
    },
    {
      id: 'cards',
      title: 'Cards',
    },
  ];

  payees: Payee[] = [
    {
      channel: 'M',
      title: 'ASIA WEALTH PLATFORM',
      copy: 'UEN 201624878Z',
    },
    {
      channel: 'I',
      title: 'Peter Parker',
      copy: 'DBS BANK LIMITED *1234',
    },
    {
      channel: 'M',
      title: 'Tony Stark Williamson',
      copy: 'Mobile +6590807065',
    },
    {
      channel: 'M',
      title: 'THE GARAGE SG PTE LTD.',
      copy: 'PayNow: 201536439H',
    },
  ];

  selectedTab: Option = this.listOptions[0];
  selectedPayeeFilter: Filter = this.payeeFilters[0];
  isPanelMaximise: boolean = false;
  showSideSheet: boolean = false;

  handlePanelChange(isMaximise: boolean): void {
    this.isPanelMaximise = isMaximise;
  }

  handleTabSelect(option: Option): void {
    this.selectedTab = option;
  }

  handlePayeeFilter(filter: Filter): void {
    this.selectedPayeeFilter = filter;
  }

  handleShowSideSheet(isShow: boolean): void {
    this.showSideSheet = isShow;
  }
}
