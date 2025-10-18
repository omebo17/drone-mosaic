import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../services/language.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  translations: any;
  bookingForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  showSuccessModal = false;
  
  // Custom dropdown state
  isDropdownOpen = false;
  selectedPackage = 'Basic Package';
  packages: string[] = [];
  
  // For FormSubmit redirect
  window = window;

  constructor(
    private languageService: LanguageService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Always scroll to top when booking page loads
    window.scrollTo(0, 0);
    
    // Initialize the form
    this.initializeForm();

    // Subscribe to translation changes
    this.languageService.translations$.subscribe(translations => {
      this.translations = translations;
      // Update packages based on current language
      this.updatePackages();
      // Set default selected package if not set yet
      if (this.packages.length > 0 && this.selectedPackage === 'Basic Package') {
        this.selectedPackage = this.packages[0];
      }
    });
  }

  initializeForm(): void {
    this.bookingForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      eventDate: ['', [Validators.required]],
      package: ['Basic Package', [Validators.required]],
      location: ['', [Validators.required]],
      details: ['']
    });
  }

  updatePackages(): void {
    if (this.translations?.booking?.form?.packageOptions) {
      this.packages = [
        this.translations.booking.form.packageOptions.basic || 'Basic Package',
        this.translations.booking.form.packageOptions.professional || 'Professional Package',
        this.translations.booking.form.packageOptions.enterprise || 'Enterprise Package',
        this.translations.booking.form.packageOptions.custom || 'Custom Package'
      ];
    } else {
      this.packages = [
        'Basic Package',
        'Professional Package',
        'Enterprise Package',
        'Custom Package'
      ];
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectPackage(packageName: string) {
    this.selectedPackage = packageName;
    this.bookingForm.patchValue({ package: packageName });
    this.isDropdownOpen = false;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log('onSubmit called');
    console.log('Form valid:', this.bookingForm.valid);
    console.log('Form errors:', this.bookingForm.errors);
    console.log('Form value:', this.bookingForm.value);
    
    if (this.bookingForm.valid && !this.isSubmitting) {
      console.log('Form is valid, submitting to Google Apps Script');
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;

      // Submit to Google Apps Script
      this.sendToGoogleScript(this.bookingForm.value);
    } else {
      console.log('Form is invalid, preventing submission');
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

  sendToGoogleScript(formData: any): void {
    const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyCRbB37W2HzSMhu-SemIWr1SAl08zmTpvV8ymRQtX2c_vawNB3MBeG2gFzgDHoGotD/exec';
    
    // Prepare form data as URL parameters
    const params = new URLSearchParams();
    params.append('fullName', formData.fullName || '');
    params.append('email', formData.email || '');
    params.append('phone', formData.phone || '');
    params.append('eventDate', formData.eventDate || '');
    params.append('package', formData.package || '');
    params.append('location', formData.location || '');
    params.append('details', formData.details || '');

    // Send as GET request with query parameters
    this.http.get(`${googleScriptUrl}?${params.toString()}`, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Form submitted successfully to Google Script', response);
          this.submitSuccess = true;
          this.isSubmitting = false;
          this.showSuccessModal = true;
          this.bookingForm.reset();
          this.selectedPackage = this.packages[0] || 'Basic Package';
        },
        error: (error) => {
          console.error('Error submitting to Google Script', error);
          this.submitError = true;
          this.isSubmitting = false;
          
          // Hide error message after 5 seconds
          setTimeout(() => {
            this.submitError = false;
          }, 5000);
        }
      });
  }

  sendEmail(formData: any): void {
    // Using FormSubmit.co - a free form backend service
    const formSubmitUrl = 'https://formsubmit.co/omebo17@freeuni.edu.ge';
    
    const emailBody = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      eventDate: formData.eventDate,
      package: formData.package,
      location: formData.location,
      details: formData.details || 'No additional details provided',
      _subject: formData.subject,
      _template: 'table'
    };

    this.http.post(formSubmitUrl, emailBody, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Email sent successfully', response);
          this.submitSuccess = true;
          this.isSubmitting = false;
          this.showSuccessModal = true;
          // this.bookingForm.reset();
          this.selectedPackage = this.packages[0] || 'Basic Package';
        },
        error: (error) => {
          console.error('Error sending email', error);
          this.submitError = true;
          this.isSubmitting = false;
          
          // Hide error message after 5 seconds
          setTimeout(() => {
            this.submitError = false;
          }, 5000);
        }
      });
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      return 'Name must be at least 2 characters';
    }
    return '';
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.submitSuccess = false;
  }

  selectPackageAndScroll(packageName: string): void {
    // Set the selected package in the form
    this.bookingForm.patchValue({ package: packageName });
    this.selectedPackage = packageName;
    
    // Scroll to the form section with smooth animation
    setTimeout(() => {
      const formSection = document.getElementById('booking-form');
      if (formSection) {
        const yOffset = -100; // Offset for fixed header
        const y = formSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

}
