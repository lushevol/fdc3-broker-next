import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../app/components/header/header.component';
import { FooterComponent } from '../app/components/footer/footer.component';
import { HomeComponent } from '../app/pages/home/home.component';
import { PayTransferComponent } from '../app/pages/pay-transfer/pay-transfer.component';
import { InvestComponent } from '../app/pages/invest/invest.component';
import { DiscoverComponent } from '../app/pages/discover/discover.component';
import { ServicesComponent } from '../app/pages/services/services.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PayTransferComponent,
    InvestComponent,
    DiscoverComponent,
    ServicesComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  selectedPage: string = 'home';

  handleMenuChange(page: string): void {
    this.selectedPage = page;
  }
}
