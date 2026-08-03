import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterMenu } from './footer-menu';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  @Output() onMenuChange = new EventEmitter<string>();

  readonly imagePath = '../../assets/footer';

  homeIcon: string = `${this.imagePath}/home.svg`;
  homeActiveIcon: string = `${this.imagePath}/home-active.svg`;
  creditCardIcon: string = `${this.imagePath}/credit-card.svg`;
  creditCardActiveIcon: string = `${this.imagePath}/credit-card-active.svg`;
  trendingUpIcon: string = `${this.imagePath}/trending-up.svg`;
  trendingUpActiveIcon: string = `${this.imagePath}/trending-up-active.svg`;
  gridIcon: string = `${this.imagePath}/grid.svg`;
  gridActiveIcon: string = `${this.imagePath}/grid-active.svg`;
  personIcon: string = `${this.imagePath}/person.svg`;
  personActiveIcon: string = `${this.imagePath}/person-active.svg`;

  navigation: FooterMenu[] = [
    {
      id: 'home',
      title: 'Home',
      icons: [this.homeIcon, this.homeActiveIcon],
    },
    {
      id: 'pay-transfer',
      title: 'Pay & transfer',
      icons: [this.creditCardIcon, this.creditCardActiveIcon],
    },
    {
      id: 'invest',
      title: 'Invest',
      icons: [this.trendingUpIcon, this.trendingUpActiveIcon],
    },
    {
      id: 'discover',
      title: 'Discover',
      icons: [this.gridIcon, this.gridActiveIcon],
    },
    {
      id: 'services',
      title: 'Services',
      icons: [this.personIcon, this.personActiveIcon],
    },
  ];

  selectedFooter: string = this.navigation[0].id;

  handleMenuChange(page: string): void {
    this.selectedFooter = page;
    this.onMenuChange.emit(page);
  }
}
