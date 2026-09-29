export interface SocialLink {
  platform: string;
  url: string;
  iconKey: string;
}

export interface PublicSettings {
  fullName: string;
  professionalTitle: string;
  oneLineBio: string;
  aboutSummary: string;
  availabilityStatus: string;
  currentLocation: string;
  cvUrl: string;
  whatsAppNumber: string;
  heroCodeTitle: string;
  heroCodeSnippet: string;
  heroBadgesJson: string;
  socialLinks: SocialLink[];
}
