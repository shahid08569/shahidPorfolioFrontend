export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  achievementsJson: string;
  achievements?: string[];
  techStackJson: string;
  techStack?: string[];
  displayOrder: number;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gradeOrHonors?: string;
  displayOrder: number;
}

export interface Timeline {
  experiences: ExperienceItem[];
  educations: EducationItem[];
}
