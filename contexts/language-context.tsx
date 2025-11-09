'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'sq' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.getStarted': 'Get Started',
    'nav.language': 'Language',
    
    // Home Page
    'home.hero.badge': "Kosovo's #1 Driving Theory Platform",
    'home.hero.title': 'Master Your',
    'home.hero.titleAccent': 'Driving Theory Exam',
    'home.hero.description': 'Practice with comprehensive mock tests, track your progress, and pass your exam with confidence. Available in Albanian and English.',
    'home.hero.startLearning': 'Start Learning Free',
    'home.hero.browseCategories': 'Browse Categories',
    
    // Features
    'features.comprehensive.title': 'Comprehensive Tests',
    'features.comprehensive.desc': '10 mock tests per category with real exam-style questions',
    'features.progress.title': 'Track Progress',
    'features.progress.desc': 'Advanced analytics and insights to monitor your improvement',
    'features.guaranteed.title': 'Pass Guaranteed',
    'features.guaranteed.desc': 'Proven methods to help you pass on your first attempt',
    
    // Categories
    'categories.title': 'Choose Your License Category',
    'categories.description': 'Select your license type and start practicing with our comprehensive mock tests',
    'categories.startPractice': 'Start Practice',
    
    // Auth
    'auth.welcomeBack': 'Welcome Back',
    'auth.signInDescription': 'Sign in to continue your driving theory practice',
    'auth.createAccount': 'Create Account',
    'auth.createAccountDescription': 'Start your journey to passing the driving theory exam',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Create Account',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.backToHome': 'Back to home',
    'auth.signingIn': 'Signing in...',
    'auth.creatingAccount': 'Creating account...',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.subtitle': 'Track your progress and continue learning',
    'dashboard.totalTests': 'Total Tests',
    'dashboard.avgScore': 'Avg Score',
    'dashboard.bestScore': 'Best Score',
    'dashboard.streak': 'Streak',
    'dashboard.thisWeek': 'this week',
    'dashboard.lastWeek': 'last week',
    'dashboard.personalBest': 'Personal best',
    'dashboard.keepGoing': 'Keep going!',
    'dashboard.days': 'days',
    'dashboard.weeklyProgress': 'Weekly Progress',
    'dashboard.weeklyProgressDesc': 'Test scores over the past week',
    'dashboard.passRate': 'Pass Rate',
    'dashboard.passRateDesc': 'Overall performance',
    'dashboard.categoryPerformance': 'Category Performance',
    'dashboard.categoryPerformanceDesc': 'Tests per category',
    'dashboard.recentTests': 'Recent Tests',
    'dashboard.recentTestsDesc': 'Latest attempts',
    'dashboard.continuelearning': 'Continue Learning',
    'dashboard.pickUpWhere': 'Pick up where you left off',
    'dashboard.continueCategoryB': 'Continue Category B',
    'dashboard.browseCategories': 'Browse Categories',
    'dashboard.startNewCategory': 'Start New Category',
    'dashboard.passed': 'Passed',
    'dashboard.failed': 'Failed',
    
    // Category Page
    'category.licenseCategory': 'License Category',
    'category.mockTests': 'Mock Tests',
    'category.minutesEach': 'minutes each',
    'category.selectTest': 'Select Your Test',
    'category.selectTestDesc': 'Choose from 10 comprehensive mock tests',
    'category.questions': 'Questions',
    'category.start': 'Start',
    
    // Test Page
    'test.exitTest': 'Exit Test',
    'test.question': 'Question',
    'test.of': 'of',
    'test.backToTests': 'Back to Tests',
    'test.congratulations': 'Congratulations!',
    'test.keepPracticing': 'Keep Practicing!',
    'test.test': 'Test',
    'test.correctAnswers': 'correct answers',
    'test.passingScore': 'Passing Score',
    'test.passed': 'Passed',
    'test.failed': 'Failed',
    'test.retakeTest': 'Retake Test',
    'test.viewAllTests': 'View All Tests',
  },
  sq: {
    // Navigation
    'nav.home': 'Ballina',
    'nav.dashboard': 'Paneli',
    'nav.login': 'Hyrje',
    'nav.logout': 'Dalje',
    'nav.getStarted': 'Fillo Tani',
    'nav.language': 'Gjuha',
    
    // Home Page
    'home.hero.badge': 'Platforma #1 e Teorisë së Drejtimit në Kosovë',
    'home.hero.title': 'Zotëro',
    'home.hero.titleAccent': 'Provimin e Teorisë së Drejtimit',
    'home.hero.description': 'Praktiko me teste gjithëpërfshirëse, gjurmo përparimin tënd dhe kalo provimin me besim. I disponueshëm në shqip dhe anglisht.',
    'home.hero.startLearning': 'Fillo Mësimin Falas',
    'home.hero.browseCategories': 'Shfleto Kategoritë',
    
    // Features
    'features.comprehensive.title': 'Teste Gjithëpërfshirëse',
    'features.comprehensive.desc': '10 teste për kategori me pyetje të stilit të provimit real',
    'features.progress.title': 'Gjurmo Përparimin',
    'features.progress.desc': 'Analitika të avancuara për të monitoruar përmirësimin tënd',
    'features.guaranteed.title': 'Kalim i Garantuar',
    'features.guaranteed.desc': 'Metoda të provuara për të kaluar në përpjekjen e parë',
    
    // Categories
    'categories.title': 'Zgjidh Kategorinë e Patentës',
    'categories.description': 'Zgjidh llojin e patentës dhe fillo praktikën me testet tona gjithëpërfshirëse',
    'categories.startPractice': 'Fillo Praktikën',
    
    // Auth
    'auth.welcomeBack': 'Mirë se Erdhe Përsëri',
    'auth.signInDescription': 'Hyr për të vazhduar praktikën e teorisë së drejtimit',
    'auth.createAccount': 'Krijo Llogari',
    'auth.createAccountDescription': 'Fillo udhëtimin për të kaluar provimin e teorisë së drejtimit',
    'auth.email': 'Email',
    'auth.password': 'Fjalëkalimi',
    'auth.confirmPassword': 'Konfirmo Fjalëkalimin',
    'auth.fullName': 'Emri i Plotë',
    'auth.signIn': 'Hyr',
    'auth.signUp': 'Krijo Llogari',
    'auth.dontHaveAccount': 'Nuk ke llogari?',
    'auth.alreadyHaveAccount': 'Ke tashmë llogari?',
    'auth.backToHome': 'Kthehu në ballina',
    'auth.signingIn': 'Duke hyrë...',
    'auth.creatingAccount': 'Duke krijuar llogari...',
    
    // Dashboard
    'dashboard.welcome': 'Mirë se erdhe përsëri',
    'dashboard.subtitle': 'Gjurmo përparimin dhe vazhdo të mësosh',
    'dashboard.totalTests': 'Teste Totale',
    'dashboard.avgScore': 'Rezultati Mesatar',
    'dashboard.bestScore': 'Rezultati më i Mirë',
    'dashboard.streak': 'Seria',
    'dashboard.thisWeek': 'këtë javë',
    'dashboard.lastWeek': 'javën e kaluar',
    'dashboard.personalBest': 'Rekord personal',
    'dashboard.keepGoing': 'Vazhdo kështu!',
    'dashboard.days': 'ditë',
    'dashboard.weeklyProgress': 'Përparimi Javor',
    'dashboard.weeklyProgressDesc': 'Rezultatet e testeve gjatë javës së kaluar',
    'dashboard.passRate': 'Shkalla e Kalimit',
    'dashboard.passRateDesc': 'Performanca e përgjithshme',
    'dashboard.categoryPerformance': 'Performanca sipas Kategorisë',
    'dashboard.categoryPerformanceDesc': 'Teste për kategori',
    'dashboard.recentTests': 'Testet e Fundit',
    'dashboard.recentTestsDesc': 'Përpjekjet e fundit',
    'dashboard.continuelearning': 'Vazhdo Mësimin',
    'dashboard.pickUpWhere': 'Vazhdo nga ku e le',
    'dashboard.continueCategoryB': 'Vazhdo Kategorinë B',
    'dashboard.browseCategories': 'Shfleto Kategoritë',
    'dashboard.startNewCategory': 'Fillo Kategori të Re',
    'dashboard.passed': 'Kaluar',
    'dashboard.failed': 'Dështuar',
    
    // Category Page
    'category.licenseCategory': 'Kategoria e Patentës',
    'category.mockTests': 'Teste Provuese',
    'category.minutesEach': 'minuta secila',
    'category.selectTest': 'Zgjidh Testin Tënd',
    'category.selectTestDesc': 'Zgjidh nga 10 teste gjithëpërfshirëse',
    'category.questions': 'Pyetje',
    'category.start': 'Fillo',
    
    // Test Page
    'test.exitTest': 'Dil nga Testi',
    'test.question': 'Pyetja',
    'test.of': 'nga',
    'test.backToTests': 'Kthehu te Testet',
    'test.congratulations': 'Urime!',
    'test.keepPracticing': 'Vazhdo të Praktikosh!',
    'test.test': 'Testi',
    'test.correctAnswers': 'përgjigje të sakta',
    'test.passingScore': 'Rezultati për Kalim',
    'test.passed': 'Kaluar',
    'test.failed': 'Dështuar',
    'test.retakeTest': 'Ri-bëj Testin',
    'test.viewAllTests': 'Shiko të Gjitha Testet',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'sq' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
