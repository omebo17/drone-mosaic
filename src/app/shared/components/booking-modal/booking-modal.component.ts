import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css'],
})
export class BookingModalComponent {
  @Input() visible = false;
  @Input() type: 'success' | 'error' = 'success';
  @Input() title = '';
  @Input() message = '';
  @Input() closeButtonText = 'Close';

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
