import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingConfigService {
  /** Google Apps Script web app URL for form submissions. */
  getGoogleScriptUrl(): string {
    return 'https://script.google.com/macros/s/AKfycbyCRbB37W2HzSMhu-SemIWr1SAl08zmTpvV8ymRQtX2c_vawNB3MBeG2gFzgDHoGotD/exec';
  }

  /** FormSubmit.co endpoint (fallback). */
  getFormSubmitUrl(): string {
    return 'https://formsubmit.co/omebo17@freeuni.edu.ge';
  }
}
