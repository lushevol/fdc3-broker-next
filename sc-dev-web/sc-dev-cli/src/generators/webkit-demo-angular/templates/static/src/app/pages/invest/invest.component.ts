import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotAvailableComponent } from '../../components/not-available/not-available.component';
import { Solution } from './solution';
import { RelatedItem } from './related-item';

@Component({
  selector: 'app-invest',
  standalone: true,
  imports: [CommonModule, NotAvailableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './invest.component.html',
  styleUrl: './invest.component.css',
})
export class InvestComponent {
  readonly imagePath = '../../assets/invest';

  accountIcon: string = `${this.imagePath}/account.svg`;
  insuranceIcon: string = `${this.imagePath}/insurance.svg`;
  investIcon: string = `${this.imagePath}/invest.svg`;
  mortgageIcon: string = `${this.imagePath}/mortgage.svg`;
  creditCardIcon: string = `${this.imagePath}/credit-cards.svg`;
  houseViewIcon: string = `${this.imagePath}/house-view.png`;

  solutions: Solution[] = [
    {
      title: 'Equities',
      icon: this.accountIcon,
    },
    {
      title: 'Unit Trusts',
      icon: this.creditCardIcon,
    },
    {
      title: 'LiveFX',
      icon: this.mortgageIcon,
    },
    {
      title: 'Goals Planner',
      icon: this.investIcon,
    },
    {
      title: 'Insure',
      icon: this.insuranceIcon,
    },
  ];

  relatedItems: RelatedItem[] = [
    {
      headline: 'Market Views on-the-go',
      title: 'House Views across the Asset Class and Global Markets',
      icon: this.houseViewIcon,
    },
  ];

  showSideSheet: boolean = false;

  handleShowSideSheet(isShow: boolean): void {
    this.showSideSheet = isShow;
  }
}
