export enum SkillCategory {
  Frontend = 0,
  Backend = 1,
  Database = 2,
  DevOps = 3,
  Tools = 4,
}

export interface SkillItem {
  id: string;
  name: string;
  iconKey?: string;
  icon?: string;
  proficiency: number;
  isTopSkill: boolean;
  displayOrder: number;
}

export interface SkillCategoryGroup {
  category: SkillCategory;
  categoryName: string;
  skills: SkillItem[];
}
