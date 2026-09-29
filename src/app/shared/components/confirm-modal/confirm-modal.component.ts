import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-dialog">
        <!-- Close Button -->
        <button class="modal-close-btn" (click)="cancel()" aria-label="Close dialog">
          <app-icon name="close" [size]="18"></app-icon>
        </button>

        <div class="modal-body">
          <div class="warning-icon-wrap" [class.danger]="isDanger">
            <app-icon [name]="isDanger ? 'trash' : 'sparkles'" [size]="28"></app-icon>
          </div>

          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-message">{{ message }}</p>

          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-outline"
              [disabled]="isLoading"
              (click)="cancel()"
            >
              {{ cancelText }}
            </button>

            <button
              type="button"
              class="btn"
              [class.btn-danger]="isDanger"
              [class.btn-primary]="!isDanger"
              [disabled]="isLoading"
              (click)="confirm()"
            >
              <span *ngIf="!isLoading">{{ confirmText }}</span>
              <span *ngIf="isLoading" class="loading-state">
                <span class="spinner"></span>
                Processing...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1.25rem;
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .modal-dialog {
        position: relative;
        background: var(--bg-card, #121826);
        border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
        border-radius: 16px;
        padding: 2rem 1.75rem 1.75rem;
        max-width: 440px;
        width: 100%;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4), 0 0 30px var(--accent-glow, rgba(56, 189, 248, 0.15));
        animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .modal-close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
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

      .modal-body {
        text-align: center;
      }

      .warning-icon-wrap {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.25rem;
        background: rgba(239, 68, 68, 0.12);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.25);
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);

        &:not(.danger) {
          background: rgba(56, 189, 248, 0.12);
          color: var(--accent-primary, #38bdf8);
          border-color: rgba(56, 189, 248, 0.25);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
        }
      }

      .modal-title {
        font-size: 1.35rem;
        font-weight: 700;
        color: var(--text-primary, #f8fafc);
        margin-bottom: 0.5rem;
        letter-spacing: -0.01em;
      }

      .modal-message {
        font-size: 0.925rem;
        color: var(--text-secondary, #94a3b8);
        line-height: 1.5;
        margin-bottom: 1.75rem;
      }

      .modal-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;

        .btn {
          flex: 1;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid transparent;
        }

        .btn-outline {
          background: transparent;
          border-color: var(--border-color, rgba(255, 255, 255, 0.15));
          color: var(--text-secondary, #cbd5e1);

          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary, #ffffff);
            border-color: var(--border-hover, rgba(255, 255, 255, 0.3));
          }
        }

        .btn-danger {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);

          &:hover:not(:disabled) {
            background: #dc2626;
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.45);
            transform: translateY(-1px);
          }
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--accent-primary, #38bdf8), var(--accent-secondary, #818cf8));
          color: #ffffff;
          box-shadow: 0 4px 14px var(--accent-glow, rgba(56, 189, 248, 0.35));

          &:hover:not(:disabled) {
            transform: translateY(-1px);
          }
        }
      }

      .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #ffffff;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
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
          transform: scale(0.94) translateY(8px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `,
  ],
})
export class ConfirmModalComponent {
  @Input() title = 'Confirm Deletion';
  @Input() message = 'Are you sure you want to delete this item? This action cannot be undone.';
  @Input() confirmText = 'Delete Permanently';
  @Input() cancelText = 'Cancel';
  @Input() isDanger = true;
  @Input() isLoading = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm(): void {
    if (!this.isLoading) {
      this.confirmed.emit();
    }
  }

  cancel(): void {
    if (!this.isLoading) {
      this.cancelled.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.cancel();
    }
  }
}
