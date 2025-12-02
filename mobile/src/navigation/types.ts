import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Testet: undefined;
  Trajneri: undefined;
  Literatura: undefined;
  Profili: undefined;
  Admin: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<MainTabParamList>;
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  CategorySelection: undefined;
  TestInstructions: { testId: string; category: string };
  TestRunner: { testId: string; category: string };
  TestResult: { 
    attemptId?: string;
    // Guest mode results (not saved to DB)
    guestResult?: {
      percentage: number;
      score: number;
      totalQuestions: number;
      category: string;
      answers: Array<{
        questionId: string;
        selectedAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        questionText: string;
        imageUrl?: string;
        optionA?: string;
        optionB?: string;
        optionC?: string;
      }>;
    };
  };
  DecisionGame: { category: string; scenarioId?: string; topic?: string };
  DecisionScenarios: { category: string };
  Subscription: undefined;
  PersonalizedTests: undefined;
  TestHistory: undefined;
  PersonalInfo: undefined;
  MaterialDetail: { materialId: string; title: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
