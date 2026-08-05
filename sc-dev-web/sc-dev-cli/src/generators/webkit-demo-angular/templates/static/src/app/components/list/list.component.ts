import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'list',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  @Input() title: string = '';
  @Input() copy: string = '';
  @Input() iconLeft: string = '';
  @Input() iconLeftSize: string = 'md';
  @Input() iconRight: string = '';
  @Input() iconRightSize: string = 'md';
  @Input() imageLeft: string = '';
  @Input() imageLeftSize: string = 'md';
  @Input() imageRight: string = '';
  @Input() imageRightSize: string = 'md';

  size(imageSize: string): number {
    switch (imageSize) {
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
