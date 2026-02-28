import { NgModule } from '@angular/core';
import { TranslatePipe } from './pipes/translate.pipe';
import { ImageCompareComponent } from './components/image-compare/image-compare.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';

@NgModule({
  declarations: [TranslatePipe, ImageCompareComponent, BookingModalComponent],
  exports: [TranslatePipe, ImageCompareComponent, BookingModalComponent],
})
export class SharedModule {}
