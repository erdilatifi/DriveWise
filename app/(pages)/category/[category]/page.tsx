'use client';

import { use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import Link from 'next/link';
import { Play, Clock, CheckCircle, Target, Shuffle, Brain } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useLanguage } from '@/contexts/language-context';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { t } = useLanguage();
  const { category: categoryParam } = use(params);
  const category = categoryParam.toUpperCase() as LicenseCategory;
  
  // Validate category
  if (!CATEGORY_INFO[category]) {
    notFound();
  }

  const categoryInfo = CATEGORY_INFO[category];
  const mockTests = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Category Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
        <div className="container relative mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('category.licenseCategory')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {categoryInfo.name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {categoryInfo.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur border border-border/50 px-6 py-3 rounded-xl">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="font-medium">10 {t('category.mockTests')}</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 backdrop-blur border border-border/50 px-6 py-3 rounded-xl">
                <Clock className="w-5 h-5 text-primary" />
                <span className="font-medium">~10 {t('category.minutesEach')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Tests Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('category.selectTest')}</h2>
          <p className="text-muted-foreground">{t('category.selectTestDesc')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {mockTests.map((testNumber) => (
            <Card 
              key={testNumber}
              className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card/50 backdrop-blur"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-4xl font-bold text-primary group-hover:scale-110 transition-transform">
                  {testNumber}
                </CardTitle>
                <CardDescription className="text-center text-xs">
                  10 {t('category.questions')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full shadow-lg shadow-primary/20" size="sm" asChild>
                  <Link href={`/test/${category.toLowerCase()}/${testNumber}`}>
                    <Play className="w-3 h-3 mr-1" />
                    {t('category.start')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mixed Test Button */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/30 shadow-lg shadow-primary/10">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shuffle className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Mixed Question Test</h3>
                  <p className="text-sm text-muted-foreground">
                    Challenge yourself with random questions from all tests in this category. Perfect for comprehensive practice!
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="shadow-lg shadow-primary/20 flex-shrink-0" 
                  asChild
                >
                  <Link href={`/test/${category.toLowerCase()}/mixed`}>
                    <Shuffle className="w-4 h-4 mr-2" />
                    Start Mixed Test
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Test Button */}
        <div className="mt-6 max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-500/10 via-card to-card border-purple-500/30 shadow-lg shadow-purple-500/10">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-8 h-8 text-purple-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Personalized Test</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice questions you got wrong! Focuses on your weak areas to improve faster. Smart learning!
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-700 flex-shrink-0" 
                  asChild
                >
                  <Link href={`/test/${category.toLowerCase()}/personalized`}>
                    <Brain className="w-4 h-4 mr-2" />
                    Start Personalized
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
