export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}
