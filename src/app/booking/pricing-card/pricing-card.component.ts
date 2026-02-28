import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pricing-card',
  templateUrl: './pricing-card.component.html',
  styleUrls: ['./pricing-card.component.css'],
})
export class PricingCardComponent {
  @Input() title = '';
  @Input() price = '';
  @Input() perEventText = '/event';
  @Input() features: string[] = [];
  @Input() buttonText = '';
  @Input() featured = false;
  @Input() popularLabel = 'POPULAR';

  @Output() select = new EventEmitter<void>();

  onSelect(): void {
    this.select.emit();
  }
}
