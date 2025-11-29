// Database types for DriveWise

export type LicenseCategory = 'A' | 'B' | 'C' | 'D';
export type LanguageCode = 'sq' | 'en';

export interface Question {
  id: string;
  category: LicenseCategory;
  topic?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuestionTranslation {
  id: string;
  question_id: string;
  language: LanguageCode;
  question_text: string;
  explanation?: string;
}

export interface AnswerOption {
  id: string;
  question_id: string;
  option_order: number;
  is_correct: boolean;
  created_at: string;
}

export interface AnswerOptionTranslation {
  id: string;
  answer_option_id: string;
  language: LanguageCode;
  option_text: string;
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

export interface TestSetQuestion {
  id: string;
  test_set_id: string;
  question_id: string;
  question_order: number;
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  preferred_language: LanguageCode;
  role?: 'student' | 'admin';
  is_admin: boolean;
  is_blocked: boolean;
  app_rating?: number; // 1-5 stars, optional
  is_premium?: boolean;
  subscription_id?: string | null;
  subscription_end?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  test_set_id?: string;
  category: LicenseCategory;
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
  selected_answer_id: string;
  is_correct: boolean;
  answered_at: string;
}

export interface StudyMaterial {
  id: string;
  category?: string;
  material_type: string;
  order_index?: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudyMaterialTranslation {
  id: string;
  study_material_id: string;
  language: LanguageCode;
  title: string;
  content: string;
}

export interface RoadSign {
  id: string;
  sign_code?: string;
  category?: string;
  image_url: string;
  created_at: string;
}

export interface RoadSignTranslation {
  id: string;
  road_sign_id: string;
  language: LanguageCode;
  name: string;
  description?: string;
}

// Composite types for queries with joins
export interface QuestionWithTranslations extends Question {
  translations: QuestionTranslation[];
  answers: AnswerOptionWithTranslations[];
}

export interface AnswerOptionWithTranslations extends AnswerOption {
  translations: AnswerOptionTranslation[];
}

export interface TestAttemptWithDetails extends TestAttempt {
  answers: TestAttemptAnswerWithQuestion[];
}

export interface TestAttemptAnswerWithQuestion extends TestAttemptAnswer {
  question: QuestionWithTranslations;
}

// Category metadata
export const CATEGORY_INFO: Record<LicenseCategory, { name: string; description: string }> = {
  A: { name: 'Category A', description: 'Motorcycles' },
  B: { name: 'Category B', description: 'Cars' },
  C: { name: 'Category C', description: 'Trucks' },
  D: { name: 'Category D', description: 'Buses' },
};

// Hazard Rush Game
export interface HazardRushRun {
  id: string;
  user_id: string;
  score: number;
  hazards_cleared: number;
  hazards_failed: number;
  average_reaction_time: number;
  seed: string;
  signature: string;
  created_at: string;
}

export interface HazardRushLeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  score: number;
  hazards_cleared: number;
  hazards_failed: number;
  accuracy: number;
  created_at: string;
}

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
  en: { name: 'English', nativeName: 'English' },
};
