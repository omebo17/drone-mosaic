import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-compare',
  templateUrl: './image-compare.component.html',
  styleUrls: ['./image-compare.component.css'],
})
export class ImageCompareComponent implements OnInit, OnChanges {
  @Input() leftImageSrc = '';
  @Input() rightImageSrc = '';
  @Input() initialPosition = 50;

  comparePosition = 50;

  ngOnInit(): void {
    this.comparePosition = this.initialPosition;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialPosition'] && changes['initialPosition'].currentValue != null) {
      this.comparePosition = changes['initialPosition'].currentValue;
    }
  }

  onCompareMove(event: MouseEvent): void {
    this.updatePosition(event.currentTarget as HTMLElement, event.clientX);
  }

  onCompareTouch(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.updatePosition(event.currentTarget as HTMLElement, event.touches[0].clientX);
      event.preventDefault();
    }
  }

  private updatePosition(container: HTMLElement, clientX: number): void {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    this.comparePosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
  }
}
