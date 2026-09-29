export interface ProjectCard {
  id: string;
  title: string;
  slug: string;
  summary: string;
  problemStatement?: string;
  solutionStatement?: string;
  architectureOverview?: string;
  keyMetrics?: string;
  lessonsLearned?: string;
  thumbnailUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  techStackJson: string;
  techStack?: string[];
  isFeatured: boolean;
  isCaseStudy: boolean;
  displayOrder: number;
}

export interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  summary: string;
  problemStatement?: string;
  solutionStatement?: string;
  architectureOverview?: string;
  keyMetrics?: string;
  lessonsLearned?: string;
  thumbnailUrl: string;
  bannerUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  techStackJson: string;
  techStack?: string[];
  isCaseStudy: boolean;
  createdAtUtc: string;
}
