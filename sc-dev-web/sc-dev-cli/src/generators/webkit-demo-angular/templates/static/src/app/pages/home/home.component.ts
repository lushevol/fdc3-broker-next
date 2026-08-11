import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAvailableComponent } from '../../components/not-available/not-available.component';
import { Profile } from './profile';
import { Banner } from './banner';
import { Shortcut } from './shortcut';
import { Account } from './account';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NotAvailableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly imagePath = '../../assets/home';

  houseView: string = `${this.imagePath}/house-view.png`;
  lifeStyle: string = `${this.imagePath}/lifestyle.png`;
  celebratory: string = `${this.imagePath}/celebratory.png`;
  accountIcon: string = `${this.imagePath}/account.svg`;
  creditCardIcon: string = `${this.imagePath}/credit-cards.svg`;
  loanIcon: string = `${this.imagePath}/loans.svg`;
  investIcon: string = `${this.imagePath}/invest.svg`;
  payNowIcon: string = `${this.imagePath}/paynow.svg`;
  fxIcon: string = `${this.imagePath}/fx.svg`;
  insightIcon: string = `${this.imagePath}/insight.svg`;
  remitIcon: string = `${this.imagePath}/sc-remit.svg`;

  profile: Profile = {
    name: 'JOHN SMITH',
  };

  banners: Banner[] = [
    {
      title: 'Save big and win bigger',
      copy: 'Stand to win a S$20,000 cash prize and get up to S$500 Cashback. T&C apply.',
      action: 'How to join',
      image: this.celebratory,
      product: 'account',
    },
    {
      title: 'Swipe, explore, enjoy! Exciting cre...',
      copy: 'Discover cashback, discounts, vouchers and more with our exclusive promotions..',
      action: 'Learn More',
      image: this.houseView,
      product: 'credit-card',
    },
    {
      title: 'Insurance',
      copy: 'Get greater peace of mind when you are insured against lifes eventualities.',
      action: 'Learn More',
      image: this.lifeStyle,
      product: 'insure',
    },
  ];

  shortcuts: Shortcut[] = [
    {
      title: 'PayNow',
      icon: this.payNowIcon,
    },
    {
      title: 'FX',
      icon: this.fxIcon,
    },
    {
      title: 'Insights',
      icon: this.insightIcon,
    },
    {
      title: 'EasyPay',
      icon: this.remitIcon,
    },
  ];

  accounts: Account[] = [
    {
      title: 'Deposits',
      icon: this.accountIcon,
      currency: 'SGD',
      amount: '123,000.90',
      label: 'Total balance',
    },
    {
      title: 'Credit Cards',
      icon: this.creditCardIcon,
      currency: 'SGD',
      amount: '300.50',
      label: 'Outstanding Balance',
    },
    {
      title: 'Investments',
      icon: this.loanIcon,
      currency: 'SGD',
      amount: '50,000.00',
      label: '',
    },
    {
      title: 'Loans',
      icon: this.investIcon,
      currency: 'SGD',
      amount: '100,000.00',
      label: 'Outstanding Balance',
    },
  ];

  showSideSheet: boolean = false;

  handleShowSideSheet(isShow: boolean): void {
    this.showSideSheet = isShow;
  }
}
