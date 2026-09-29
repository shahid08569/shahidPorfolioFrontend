import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-dialog">
        <!-- Close Button -->
        <button class="modal-close-btn" (click)="close()" aria-label="Close dialog">
          <app-icon name="close" [size]="18"></app-icon>
        </button>

        <!-- Header -->
        <div class="modal-header">
          <div class="header-icon">
            <app-icon name="sparkles" [size]="24"></app-icon>
          </div>
          <h2 class="modal-title">Leave an Endorsement</h2>
          <p class="modal-subtitle">
            Worked with Shahid or collaborated on a project? Share your experience below. Submissions are reviewed prior to publication.
          </p>
        </div>

        <!-- Success View -->
        <div class="success-box" *ngIf="isSubmitted()">
          <div class="success-icon">
            <app-icon name="check" [size]="32"></app-icon>
          </div>
          <h3>Thank You So Much!</h3>
          <p>
            Your endorsement has been submitted successfully and sent to Shahid for review. It will appear on the portfolio once approved.
          </p>
          <button type="button" class="btn btn-primary" (click)="close()">
            Done
          </button>
        </div>

        <!-- Form View -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!isSubmitted()" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="clientName" class="form-label">Your Full Name *</label>
              <input
                id="clientName"
                type="text"
                formControlName="clientName"
                placeholder="e.g. Sarah Jenkins"
                class="form-control"
                [class.invalid]="form.get('clientName')?.invalid && form.get('clientName')?.touched"
              />
            </div>

            <div class="form-group">
              <label for="role" class="form-label">Your Role / Title *</label>
              <input
                id="role"
                type="text"
                formControlName="role"
                placeholder="e.g. VP of Engineering"
                class="form-control"
                [class.invalid]="form.get('role')?.invalid && form.get('role')?.touched"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="company" class="form-label">Company / Organization *</label>
              <input
                id="company"
                type="text"
                formControlName="company"
                placeholder="e.g. CloudScale Systems"
                class="form-control"
                [class.invalid]="form.get('company')?.invalid && form.get('company')?.touched"
              />
            </div>

            <div class="form-group">
              <label for="relationship" class="form-label">Relationship / Context</label>
              <select id="relationship" formControlName="relationship" class="form-control">
                <option value="Client / Partner">Client / Business Partner</option>
                <option value="Engineering Colleague">Engineering Colleague</option>
                <option value="Direct Manager / Lead">Direct Manager / Lead</option>
                <option value="Mentee / Contributor">Mentee / Contributor</option>
              </select>
            </div>
          </div>

          <!-- Star Rating Selector -->
          <div class="form-group rating-group">
            <label class="form-label">Overall Rating</label>
            <div class="star-rating-row">
              <button
                type="button"
                *ngFor="let star of [1, 2, 3, 4, 5]"
                class="star-btn"
                [class.active]="star <= selectedRating()"
                (click)="setRating(star)"
                [attr.aria-label]="star + ' stars'"
              >
                ★
              </button>
              <span class="rating-label">{{ selectedRating() }} out of 5 stars</span>
            </div>
          </div>

          <div class="form-group">
            <label for="content" class="form-label">Your Endorsement &amp; Feedback *</label>
            <textarea
              id="content"
              rows="4"
              formControlName="content"
              placeholder="Describe your experience collaborating with Shahid, the quality of delivery, and technical impact..."
              class="form-control"
              [class.invalid]="form.get('content')?.invalid && form.get('content')?.touched"
            ></textarea>
            <span class="field-hint" *ngIf="form.get('content')?.invalid && form.get('content')?.touched">
              Please enter at least 10 characters.
            </span>
          </div>

          <div class="form-group">
            <label for="linkedInUrl" class="form-label">LinkedIn Profile URL (Optional)</label>
            <input
              id="linkedInUrl"
              type="url"
              formControlName="linkedInUrl"
              placeholder="https://linkedin.com/in/yourprofile"
              class="form-control"
            />
          </div>

          <div class="error-banner" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline" (click)="close()">
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || isSubmitting()"
            >
              <span *ngIf="!isSubmitting()">Submit for Review</span>
              <span *ngIf="isSubmitting()">Submitting...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1.5rem;
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .modal-dialog {
        position: relative;
        background: var(--bg-card, #121826);
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
        border-radius: 18px;
        padding: 2.25rem 2rem 2rem;
        max-width: 580px;
        width: 100%;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 35px var(--accent-glow, rgba(56, 189, 248, 0.15));
        animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        max-height: 90vh;
        overflow-y: auto;
      }

      .modal-close-btn {
        position: absolute;
        top: 1.25rem;
        right: 1.25rem;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        color: var(--text-muted, #94a3b8);
        border: none;
        background: transparent;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          color: var(--text-primary, #ffffff);
          background: rgba(255, 255, 255, 0.08);
        }
      }

      .modal-header {
        text-align: center;
        margin-bottom: 1.75rem;

        .header-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.85rem;
          background: rgba(56, 189, 248, 0.12);
          color: var(--accent-primary, #38bdf8);
          border: 1px solid rgba(56, 189, 248, 0.25);
          box-shadow: 0 0 20px var(--accent-glow, rgba(56, 189, 248, 0.25));
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary, #f8fafc);
          letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
        }

        .modal-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary, #94a3b8);
          line-height: 1.5;
        }
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        @media (min-width: 640px) {
          grid-template-columns: 1fr 1fr;
        }
      }

      .form-group {
        margin-bottom: 1.15rem;

        .form-label {
          display: block;
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--text-secondary, #cbd5e1);
          margin-bottom: 0.35rem;
        }

        .form-control {
          width: 100%;
          padding: 0.7rem 0.95rem;
          font-size: 0.9rem;
          border-radius: 9px;
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
          background: var(--bg-secondary, #0b0f19);
          color: var(--text-primary, #f8fafc);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: inherit;

          &:focus {
            outline: none;
            border-color: var(--accent-primary, #38bdf8);
            box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
          }

          &.invalid {
            border-color: #ef4444;
          }
        }

        .field-hint {
          display: block;
          font-size: 0.775rem;
          color: #ef4444;
          margin-top: 0.25rem;
        }
      }

      .rating-group {
        .star-rating-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .star-btn {
          font-size: 1.6rem;
          line-height: 1;
          color: rgba(255, 255, 255, 0.2);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.15s ease, transform 0.15s ease;
          padding: 0 0.1rem;

          &:hover {
            transform: scale(1.15);
          }

          &.active {
            color: #fbbf24;
            text-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
          }
        }

        .rating-label {
          font-size: 0.85rem;
          color: var(--text-muted, #94a3b8);
          margin-left: 0.5rem;
          font-weight: 500;
        }
      }

      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));

        .btn {
          padding: 0.7rem 1.4rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
          color: var(--text-secondary, #cbd5e1);

          &:hover {
            border-color: var(--border-hover, rgba(255, 255, 255, 0.3));
            color: #ffffff;
          }
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent-primary, #38bdf8), var(--accent-secondary, #818cf8));
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 14px var(--accent-glow, rgba(56, 189, 248, 0.35));

          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px var(--accent-glow, rgba(56, 189, 248, 0.45));
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }

      .success-box {
        text-align: center;
        padding: 2rem 1rem;

        .success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          border: 1px solid rgba(34, 197, 94, 0.3);
          box-shadow: 0 0 25px rgba(34, 197, 94, 0.3);
        }

        h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary, #ffffff);
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 0.925rem;
          color: var(--text-secondary, #cbd5e1);
          line-height: 1.6;
          margin-bottom: 1.75rem;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }
      }

      .error-banner {
        padding: 0.75rem;
        border-radius: 8px;
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
        font-size: 0.85rem;
        margin-top: 1rem;
        text-align: center;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `,
  ],
})
export class FeedbackModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);

  @Output() closed = new EventEmitter<void>();

  readonly selectedRating = signal(5);
  readonly isSubmitting = signal(false);
  readonly isSubmitted = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    clientName: ['', [Validators.required, Validators.maxLength(100)]],
    role: ['', [Validators.required, Validators.maxLength(100)]],
    company: ['', [Validators.required, Validators.maxLength(100)]],
    relationship: ['Client / Partner'],
    content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    linkedInUrl: [''],
  });

  setRating(rating: number): void {
    this.selectedRating.set(rating);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      ...this.form.value,
      rating: this.selectedRating(),
    };

    this.apiService.submitTestimonial(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSubmitted.set(true);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to submit endorsement. Please try again.');
      },
    });
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }
}
