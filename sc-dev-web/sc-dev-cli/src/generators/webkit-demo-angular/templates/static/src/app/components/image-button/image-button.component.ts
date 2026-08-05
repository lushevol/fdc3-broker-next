import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'image-button',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './image-button.component.html',
  styleUrl: './image-button.component.css',
})
export class ImageButtonComponent {
  @Input() title: string = '';
  @Input() image: string = '';
  @Input() imageSize: string = 'md';
  @Input() highlight: boolean = false;
  @Input() compact: boolean = false;

  size(): number {
    switch (this.imageSize) {
      case 'sm':
        return 16;
      case 'md':
        return 24;
      case 'lg':
        return 32;
      default:
        return 24;
    }
  }
}
