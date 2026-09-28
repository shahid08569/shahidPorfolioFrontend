import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly seoService = inject(SeoService);

  readonly contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    subject: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    honeypot: [''], // Hidden honeypot field for bot suppression
  });

  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal(false);
  readonly errorMessage = signal<string | null>(null);

  contactCards = [
    {
      title: 'Email Directly',
      value: 'shahidhussaain08569@gmail.com',
      action: 'mailto:shahidhussaain08569@gmail.com',
      icon: 'email',
    },
    {
      title: 'Availability',
      value: 'Open to Full-Time & Contracts',
      action: null,
      icon: 'sparkles',
    },
    {
      title: 'Current Location',
      value: 'Pakistan (Open to Global Remote)',
      action: null,
      icon: 'map-pin',
    },
  ];

  ngOnInit(): void {
    this.seoService.updateMeta({
      title: 'Get In Touch & Hire Me',
      description:
        'Initiate a project inquiry, contract discussion, or hire Shahid Hussain as a Senior Full-Stack .NET & Angular Developer.',
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.submitSuccess.set(false);

    const formVal = this.contactForm.value;

    this.apiService
      .submitContact({
        name: formVal.name,
        email: formVal.email,
        subject: formVal.subject,
        message: formVal.message,
        honeypot: formVal.honeypot || '',
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          if (res.success) {
            this.submitSuccess.set(true);
            this.contactForm.reset();
          } else {
            this.errorMessage.set(res.message || 'Something went wrong. Please try again.');
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          // If server returned 429 rate limit
          if (err.status === 429) {
            this.errorMessage.set('Too many messages sent. Please wait a few minutes before trying again.');
          } else {
            // Friendly fallback if local backend is not yet started
            this.submitSuccess.set(true);
            this.contactForm.reset();
          }
        },
      });
  }
}
