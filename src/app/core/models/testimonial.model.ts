export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatarUrl?: string;
  content: string;
  linkedInUrl?: string;
  rating: number;
  relationship?: string;
  isApproved: boolean;
  isActive: boolean;
  displayOrder: number;
  submittedAtUtc: string;
}

export interface SubmitTestimonialPayload {
  clientName: string;
  role: string;
  company: string;
  avatarUrl?: string;
  content: string;
  linkedInUrl?: string;
  rating: number;
  relationship?: string;
}
