// Database types for DriveWise

export type LicenseCategory = 'A' | 'B' | 'C' | 'D';
export type LanguageCode = 'sq';

export interface Question {
  id: string;
  category: LicenseCategory;
  test_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_answer: 'A' | 'B' | 'C';
  image_url?: string;
  topic?: string;
  difficulty?: string;
  created_at: string;
  updated_at: string;
}

export interface TestSet {
  id: string;
  category: LicenseCategory;
  test_number: number;
  name?: string;
  is_random: boolean;
  question_count: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  is_admin: boolean;
  is_blocked: boolean;
  app_rating?: number;
  avatar_url?: string;
  subscription_id?: string | null;
  is_premium?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  category: LicenseCategory;
  test_number: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_seconds?: number;
  is_assigned: boolean;
  assigned_by?: string;
  started_at: string;
  completed_at: string;
}

export interface TestAttemptAnswer {
  id: string;
  test_attempt_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  answered_at: string;
}

export interface StudyMaterial {
  id: string;
  chapter_id: number;
  category?: LicenseCategory;
  title: string;
  content: Record<string, unknown>;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MaterialImage {
  id: string;
  material_id: string;
  image_url: string;
  caption?: string;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface TrafficSign {
  id: string;
  code: string;
  category: string;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Category metadata
export const CATEGORY_INFO: Record<LicenseCategory, { name: string; description: string }> = {
  A: { name: 'Kategoria A', description: 'Motoçikleta' },
  B: { name: 'Kategoria B', description: 'Vetura' },
  C: { name: 'Kategoria C', description: 'Kamionë' },
  D: { name: 'Kategoria D', description: 'Autobusë' },
};

export interface UserPlan {
  id: string;
  user_id: string;
  category: LicenseCategory;
  plan_tier: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  category: LicenseCategory;
  plan_tier: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  order_id: string;
  provider: string;
  provider_status: string;
  amount_cents: number;
  currency: string;
  raw_payload: any;
  created_at: string;
  updated_at: string;
}

// Language metadata
export const LANGUAGE_INFO: Record<LanguageCode, { name: string; nativeName: string }> = {
  sq: { name: 'Albanian', nativeName: 'Shqip' },
};
