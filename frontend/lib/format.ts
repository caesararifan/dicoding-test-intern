import type { EmploymentType, ExperienceLevel } from './types';

export const EMPLOYMENT_LABEL: Record<EmploymentType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Kontrak',
  intern: 'Intern',
};

export const EXPERIENCE_LABEL: Record<ExperienceLevel, string> = {
  lt_1: 'Kurang dari 1 tahun',
  '1_3': '1-3 tahun',
  '4_5': '4-5 tahun',
  '6_10': '6-10 tahun',
  gt_10: 'Lebih dari 10 tahun',
};

export const POSITIONS = [
  'Software Engineer',
  'Mobile Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data & Analytics',
  'Design',
  'Product Manager',
  'QA Engineer',
];

export const LOCATIONS = ['Bandung', 'Jakarta', 'Surabaya', 'Yogyakarta', 'Bogor', 'Medan', 'Bali'];

export const formatDate = (iso: string, timeZone = 'UTC') =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone });


export const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);