import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../core/services/language.service';
import { BookingConfigService } from '../core/services/booking-config.service';
import { ScrollService } from '../core/services/scroll.service';
import { SECTION_IDS, SCROLL_TO_FORM_OFFSET_PX } from '../core/constants/layout.constants';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { takeUntil, timeout, catchError } from 'rxjs/operators';

export interface PricingCardConfig {
  packageName: string;
  title: string;
  price: string;
  perEventText: string;
  features: string[];
  buttonText: string;
  featured: boolean;
  popularLabel: string;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  translations: any;
  bookingForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  showSuccessModal = false;

  isDropdownOpen = false;
  selectedPackage = 'Basic Package';
  packages: string[] = [];
  pricingCards: PricingCardConfig[] = [];

  window = window;

  constructor(
    private languageService: LanguageService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private bookingConfig: BookingConfigService,
    private scrollService: ScrollService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initializeForm();
    this.buildPricingCards();

    this.languageService.translations$.pipe(takeUntil(this.destroy$)).subscribe(translations => {
      this.translations = translations;
      this.updatePackages();
      this.buildPricingCards();
      if (this.packages.length > 0 && this.selectedPackage === 'Basic Package') {
        this.selectedPackage = this.packages[0];
      }
    });
  }

  buildPricingCards(): void {
    const t = this.translations?.booking?.packages;
    const perEvent = this.translations?.booking?.packages?.perEvent ?? '/event';
    const popularLabel = this.translations?.booking?.packages?.popularLabel ?? 'POPULAR';
    this.pricingCards = [
      {
        packageName: 'Basic Package',
        title: t?.basic?.title ?? 'Basic',
        price: t?.basic?.price ?? '$2,999',
        perEventText: perEvent,
        features: [
          t?.basic?.features?.drones ?? '25 drones',
          t?.basic?.features?.duration ?? '5-minute show',
          t?.basic?.features?.formations ?? 'Pre-designed formations',
          t?.basic?.features?.lights ?? 'Basic light effects',
          t?.basic?.features?.support ?? 'Standard support',
        ],
        buttonText: t?.basic?.button ?? 'Select Basic',
        featured: false,
        popularLabel,
      },
      {
        packageName: 'Professional Package',
        title: t?.professional?.title ?? 'Professional',
        price: t?.professional?.price ?? '$5,999',
        perEventText: perEvent,
        features: [
          t?.professional?.features?.drones ?? '100 drones',
          t?.professional?.features?.duration ?? '10-minute show',
          t?.professional?.features?.formations ?? 'Custom formations & logos',
          t?.professional?.features?.lights ?? 'Advanced light effects',
          t?.professional?.features?.support ?? 'Priority support',
          t?.professional?.features?.video ?? 'Video recording included',
        ],
        buttonText: t?.professional?.button ?? 'Select Professional',
        featured: true,
        popularLabel,
      },
      {
        packageName: 'Enterprise Package',
        title: t?.enterprise?.title ?? 'Enterprise',
        price: t?.enterprise?.price ?? '$12,999',
        perEventText: perEvent,
        features: [
          t?.enterprise?.features?.drones ?? '300+ drones',
          t?.enterprise?.features?.duration ?? '15+ minute show',
          t?.enterprise?.features?.custom ?? 'Fully customized show',
          t?.enterprise?.features?.lights ?? 'Premium light & sound',
          t?.enterprise?.features?.support ?? '24/7 dedicated support',
          t?.enterprise?.features?.video ?? 'Professional video crew',
          t?.enterprise?.features?.consultation ?? 'Consultation included',
        ],
        buttonText: t?.enterprise?.button ?? 'Select Enterprise',
        featured: false,
        popularLabel,
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      const o = this.translations.booking.form.packageOptions;
      this.packages = [
        o.basic || 'Basic Package',
        o.professional || 'Professional Package',
        o.enterprise || 'Enterprise Package',
        o.custom || 'Custom Package'
      ];
    } else {
      this.packages = ['Basic Package', 'Professional Package', 'Enterprise Package', 'Custom Package'];
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
    if (this.bookingForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;
      this.sendToGoogleScript(this.bookingForm.value);
    } else {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

  sendToGoogleScript(formData: Record<string, unknown>): void {
    const url = this.bookingConfig.getGoogleScriptUrl();
    const params = new URLSearchParams();
    params.append('fullName', String(formData['fullName'] ?? ''));
    params.append('email', String(formData['email'] ?? ''));
    params.append('phone', String(formData['phone'] ?? ''));
    params.append('eventDate', String(formData['eventDate'] ?? ''));
    params.append('package', String(formData['package'] ?? ''));
    params.append('location', String(formData['location'] ?? ''));
    params.append('details', String(formData['details'] ?? ''));

    this.http.get(`${url}?${params.toString()}`, { responseType: 'text' })
      .pipe(
        timeout(15000),
        takeUntil(this.destroy$),
        catchError(() => of(null))
      )
      .subscribe({
        next: (response) => {
          this.ngZone.run(() => {
            this.isSubmitting = false;
            if (response !== null) {
              this.submitSuccess = true;
              this.showSuccessModal = true;
              this.bookingForm.reset();
              this.selectedPackage = this.packages[0] || 'Basic Package';
            } else {
              this.submitError = true;
              setTimeout(() => { this.submitError = false; this.cdr.detectChanges(); }, 5000);
            }
            this.cdr.detectChanges();
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.submitError = true;
            this.isSubmitting = false;
            this.cdr.detectChanges();
            setTimeout(() => {
              this.submitError = false;
              this.cdr.detectChanges();
            }, 5000);
          });
        }
      });
  }

  sendEmail(formData: Record<string, unknown>): void {
    const formSubmitUrl = this.bookingConfig.getFormSubmitUrl();
    const emailBody = {
      name: formData['fullName'],
      email: formData['email'],
      phone: formData['phone'],
      eventDate: formData['eventDate'],
      package: formData['package'],
      location: formData['location'],
      details: (formData['details'] as string) || 'No additional details provided',
      _subject: formData['subject'],
      _template: 'table'
    };

    this.http.post(formSubmitUrl, emailBody, { responseType: 'text' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submitSuccess = true;
          this.isSubmitting = false;
          this.showSuccessModal = true;
          this.selectedPackage = this.packages[0] || 'Basic Package';
        },
        error: () => {
          this.submitError = true;
          this.isSubmitting = false;
          setTimeout(() => { this.submitError = false; }, 5000);
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

  closeModal(): void {
    this.showSuccessModal = false;
    this.submitSuccess = false;
    this.submitError = false;
  }

  selectPackageAndScroll(packageName: string): void {
    this.bookingForm.patchValue({ package: packageName });
    this.selectedPackage = packageName;
    setTimeout(() => {
      const formSection = document.getElementById(SECTION_IDS.BOOKING_FORM);
      if (formSection) {
        const y = formSection.getBoundingClientRect().top + window.pageYOffset - SCROLL_TO_FORM_OFFSET_PX;
        this.scrollService.smoothScrollTo(y, { duration: 500 });
      }
    }, 100);
  }
}
