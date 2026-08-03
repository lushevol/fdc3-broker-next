import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageButtonComponent } from '../../components/image-button/image-button.component';
import { ListComponent } from '../../components/list/list.component';
import { NotAvailableComponent } from '../../components/not-available/not-available.component';
import { Product } from './product';
import { Promotion } from './promotion';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    CommonModule,
    ImageButtonComponent,
    ListComponent,
    NotAvailableComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './discover.component.html',
  styles: ``,
})
export class DiscoverComponent {
  readonly imagePath = '../../assets/discover';

  accountIcon: string = `${this.imagePath}/account.svg`;
  creditCardIcon: string = `${this.imagePath}/credit-cards.svg`;
  loanIcon: string = `${this.imagePath}/loans.svg`;
  investIcon: string = `${this.imagePath}/invest.svg`;
  insureIcon: string = `${this.imagePath}/insurance.svg`;
  mortgageIcon: string = `${this.imagePath}/mortgage.svg`;
  creditCardPromotionIcon: string = `${this.imagePath}/credit-card-active.svg`;
  referFriendIcon: string = `${this.imagePath}/pay-transfer.svg`;

  allProduct: Product = {
    id: 'all',
    title: 'All',
    icon: '',
    solutions: [
      {
        title: 'Account',
        icon: this.accountIcon,
      },
      {
        title: 'Credit Card',
        icon: this.creditCardIcon,
      },
      {
        title: 'Loans',
        icon: this.loanIcon,
      },
      {
        title: 'Invest',
        icon: this.investIcon,
      },
      {
        title: 'Insure',
        icon: this.insureIcon,
      },
      {
        title: 'Mortgages',
        icon: this.mortgageIcon,
      },
    ],
  };

  products: Product[] = [
    {
      id: 'accounts',
      title: 'Accounts',
      icon: this.accountIcon,
      solutions: [
        {
          title: 'Current Account',
          icon: this.accountIcon,
        },
        {
          title: 'Savings Account',
          icon: this.accountIcon,
        },
        {
          title: 'Foreign Currency',
          icon: this.accountIcon,
        },
        {
          title: 'Time Deposit',
          icon: this.accountIcon,
        },
      ],
    },
    {
      id: 'credit-card',
      title: 'Credit Card',
      icon: this.creditCardIcon,
      solutions: [
        {
          title: 'Cashback',
          icon: this.creditCardIcon,
        },
        {
          title: 'Miles and Rewards',
          icon: this.creditCardIcon,
        },
        {
          title: 'Credit Limit',
          icon: this.creditCardIcon,
        },
        {
          title: 'Cash Transfer',
          icon: this.creditCardIcon,
        },
        {
          title: 'Credit Card Promotions',
          icon: this.creditCardIcon,
        },
      ],
      feature: {
        title: 'Card Features',
        features: [
          {
            title: 'Get cash in 15 minutes with CashOne',
            copy: 'Interest rates from 3.48% p.a. (EIR from 6.95% p.a.)',
          },
          {
            title: 'Get interest-free cash with Credit Card Funds Transfer',
            copy: 'Flexible repayment and low processing fee',
          },
          {
            title: 'Get a Temporary Credit Limit Increase',
            copy: 'For emergencies, expenses for your overseas travel, or wedding banquet',
          },
        ],
      },
    },
    {
      id: 'loans',
      title: 'Loans',
      icon: this.loanIcon,
      solutions: [
        {
          title: 'Personal Loans',
          icon: this.loanIcon,
        },
        {
          title: 'Flexible Repayment Loans',
          icon: this.loanIcon,
        },
      ],
      feature: {
        title: 'Loan Tailored To Your Needs',
        features: [
          {
            title: 'Get interest-free cash with Credit Card Funds Transfer',
            copy: 'Flexible repayment and low processing fee',
          },
        ],
      },
    },
    {
      id: 'invest',
      title: 'Invest',
      icon: this.investIcon,
      solutions: [],
    },
    {
      id: 'insure',
      title: 'Insure',
      icon: this.insureIcon,
      solutions: [],
    },
    {
      id: 'mortgages',
      title: 'Mortgages',
      icon: this.mortgageIcon,
      solutions: [
        {
          title: 'Mortgage for Home',
          icon: this.mortgageIcon,
        },
      ],
    },
  ];

  promotions: Promotion[] = [
    {
      title: 'Credit Card Promotions',
      icon: this.creditCardPromotionIcon,
    },
    {
      title: 'Refer A Friend',
      icon: this.referFriendIcon,
    },
  ];

  selectedProduct: Product = this.allProduct;
  title: string = 'Our Solutions';
  showSideSheet: boolean = false;

  handleProductChange(product: Product): void {
    this.selectedProduct = product;
    this.title =
      product.id === 'all'
        ? 'Our Solutions'
        : `Find Out The Best ${product.title} For You`;
  }

  handleShowSideSheet(isShow: boolean): void {
    this.showSideSheet = isShow;
  }
}
