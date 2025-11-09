'use client';

import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { CATEGORY_INFO, type LicenseCategory } from '@/types/database';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Bike, Truck, Bus, Zap, Target, TrendingUp, Shield } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';

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
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container relative mx-auto px-6 py-24 md:py-32 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t('home.hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {t('home.hero.title')}
              <span className="block text-primary mt-2">{t('home.hero.titleAccent')}</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20">
                <Link href="/register">
                  {t('home.hero.startLearning')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base font-semibold">
                <Link href="#categories">
                  {t('home.hero.browseCategories')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: t('features.comprehensive.title'), desc: t('features.comprehensive.desc') },
            { icon: TrendingUp, title: t('features.progress.title'), desc: t('features.progress.desc') },
            { icon: Shield, title: t('features.guaranteed.title'), desc: t('features.guaranteed.desc') }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard hover className="p-6 h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold">{t('categories.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('categories.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <GlassCard className="p-6 group cursor-pointer h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {categoryIcons[category]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {CATEGORY_INFO[category].name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {CATEGORY_INFO[category].description}
                    </p>
                  </div>
                </div>
                <Button className="w-full shadow-lg shadow-primary/20" asChild>
                  <Link href={`/category/${category.toLowerCase()}`}>
                    {t('categories.startPractice')}
                  </Link>
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/30">
                <Image 
                  src="/logo-white.png" 
                  alt="DriveWise Logo" 
                  width={40} 
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-semibold">DriveWise</span>
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