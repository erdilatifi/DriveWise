'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Bike, Truck, Bus, Zap, Target, TrendingUp, Shield } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useLanguage } from '@/contexts/language-context';

const categoryIcons: Record<LicenseCategory, React.ReactNode> = {
  A: <Bike className="w-8 h-8" />,
  B: <Car className="w-8 h-8" />,
  C1: <Truck className="w-8 h-8" />,
  C: <Truck className="w-8 h-8" />,
  CE: <Truck className="w-8 h-8" />,
  D: <Bus className="w-8 h-8" />,
};

export default function HomePage() {
  const { t } = useLanguage();
  const categories = Object.keys(CATEGORY_INFO) as LicenseCategory[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('home.hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('home.hero.title')}
              <span className="block text-primary">{t('home.hero.titleAccent')}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg h-14 px-8 shadow-lg shadow-primary/20">
                <Link href="/register">
                  {t('home.hero.startLearning')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8">
                <Link href="#categories">
                  {t('home.hero.browseCategories')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('features.comprehensive.title')}</CardTitle>
              <CardDescription>
                {t('features.comprehensive.desc')}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('features.progress.title')}</CardTitle>
              <CardDescription>
                {t('features.progress.desc')}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>{t('features.guaranteed.title')}</CardTitle>
              <CardDescription>
                {t('features.guaranteed.desc')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('categories.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('categories.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <Card 
              key={category} 
              className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card/50 backdrop-blur"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                    {categoryIcons[category]}
                  </div>
                  <div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">{CATEGORY_INFO[category].name}</CardTitle>
                    <CardDescription>{CATEGORY_INFO[category].description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full shadow-lg shadow-primary/20" asChild>
                  <Link href={`/category/${category.toLowerCase()}`}>
                    {t('categories.startPractice')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-primary/30">
                <Image 
                  src="/logo-white.png" 
                  alt="DriveWise Logo" 
                  width={32} 
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold">DriveWise</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 DriveWise. Kosovo's Premier Driving Theory Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}