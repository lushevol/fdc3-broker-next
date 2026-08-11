import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'swipable-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swipable-panel.component.html',
  styleUrl: './swipable-panel.component.css',
})
export class SwipablePanelComponent {
  @Input() minHeight: string = '320px';
  @Input() maxHeight: string = '800px';
  @Input() expand: boolean = false;
  @Input() threshold: number = 50;
  @Output() onMinimise = new EventEmitter<void>();
  @Output() onMaximise = new EventEmitter<void>();

  panelHeight: string = this.expand ? this.maxHeight : this.minHeight;
  startY?: number = undefined;

  handleTouchStart(event: TouchEvent): void {
    this.startY = event.touches[0].clientY;
  }

  handleTouchMove(event: TouchEvent): void {
    if (this.startY === undefined) return;

    const deltaY = event.touches[0].clientY - this.startY;

    if (deltaY > this.threshold) {
      this.panelHeight = this.minHeight;
      this.onMinimise.emit();
    } else if (deltaY < -this.threshold) {
      this.panelHeight = this.maxHeight;
      this.onMaximise.emit();
    }
  }

  handleTouchEnd(event: Event): void {
    this.startY = undefined;
  }
}
