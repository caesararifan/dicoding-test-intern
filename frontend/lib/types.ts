export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';
export type ExperienceLevel = 'lt_1' | '1_3' | '4_5' | '6_10' | 'gt_10';

export interface Company {
  id: number;
  name: string;
  logo_url: string | null;
  business_sector: string | null;
  size: string | null;
  website: string | null;
}

export interface Vacancy {
  id: number;
  title: string;
  position: string;
  employment_type: EmploymentType;
  candidates_needed: number;
  active_until: string;
  location: string;
  is_remote: boolean;
  description: string;
  show_salary: boolean;
  salary_min: number | null;
  salary_max: number | null;
  min_experience: ExperienceLevel;
  company?: Company;
  created_at: string;
}

export interface Paginated<T> {
  data: T[];

  meta: { current_page: number; last_page: number; total: number };
}

export interface VacancyInput {
  title: string;
  position: string;
  employment_type: EmploymentType;
  candidates_needed: number;
  active_until: string;
  location: string;
  is_remote: boolean;
  description: string;
  salary_min: number;
  salary_max: number | null;
  show_salary: boolean;
  min_experience: ExperienceLevel;
}