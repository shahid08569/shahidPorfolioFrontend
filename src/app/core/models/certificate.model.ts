export interface Certificate {
  id: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}
