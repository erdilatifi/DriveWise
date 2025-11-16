'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, Globe, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, isAdmin, userProfile, loading: authLoading } = useAuth();
  const pathname = usePathname();

  // Get display name from userProfile or fallback to email
  const displayName = userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (lang: 'sq' | 'en') => {
    setLanguage(lang);
    setLanguageMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setMobileMenuOpen(false);
      toast.success('Logged out successfully');
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
      scrolled ? 'top-0 w-full' : 'top-4 w-[90%]'
    }`}>
      <div className={`bg-card/95 backdrop-blur-xl border border-border/40 shadow-lg shadow-black/20 transition-all duration-300 ${
        scrolled ? 'rounded-none border-t-0 border-x-0' : 'rounded-2xl'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full group-hover:bg-primary/40 transition-all duration-300"></div>
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-xl shadow-primary/20 group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105 border-2 border-primary/30 group-hover:border-primary/50">
                <Image 
                  src="/logo-white.png" 
                  alt="DriveWise Logo" 
                  width={48} 
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">
                DriveWise
              </span>
              <span className="text-xs text-primary font-medium -mt-1">Kosovo Theory Exam</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-semibold transition-all duration-200 relative group/link ${
                isActive('/') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              {t('nav.home')}
              {isActive('/') && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
              )}
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-semibold transition-all duration-200 relative group/link ${
                isActive('/dashboard') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              {t('nav.dashboard')}
              {isActive('/dashboard') && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
              )}
            </Link>
            {user && (
              <Link
                href="/decision-trainer"
                className={`text-sm font-semibold transition-all duration-200 relative group/link ${
                  pathname.startsWith('/decision-trainer') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                 Decision Trainer
                {pathname.startsWith('/decision-trainer') && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
                )}
              </Link>
            )}
            {user && isAdmin && (
              <Link
                href="/admin"
                className={`text-sm font-semibold transition-all duration-200 relative group/link ${
                  isActive('/admin') || pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                Admin
                {(isActive('/admin') || pathname.startsWith('/admin')) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"></span>
                )}
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 group"
              >
                <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {language === 'en' ? 'EN' : 'SQ'}
                </span>
              </button>
              
              {/* Language Dropdown */}
              {languageMenuOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-card border border-border/50 rounded-xl shadow-xl shadow-black/20 overflow-hidden z-50">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-primary/10 transition-colors ${
                      language === 'en' ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    <span className="font-medium">English</span>
                    {language === 'en' && <Check className="w-4 h-4 text-primary" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('sq')}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-primary/10 transition-colors ${
                      language === 'sq' ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    <span className="font-medium">Shqip</span>
                    {language === 'sq' && <Check className="w-4 h-4 text-primary" />}
                  </button>
                </div>
              )}
            </div>
            
            {authLoading ? (
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">{displayName}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-border/50 hover:border-primary/50">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link href="/login">{t('nav.login')}</Link>
                </Button>
                <Button size="sm" asChild className="shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 font-semibold">
                  <Link href="/register">{t('nav.getStarted')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-all duration-200 border border-border/50 hover:border-primary/30"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/40 bg-card/50 backdrop-blur-xl animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">{displayName}</span>
                </div>
              )}
              <Link
                href="/"
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/dashboard"
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/dashboard') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              {user && (
                <Link
                  href="/decision-trainer"
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    pathname.startsWith('/decision-trainer') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                   Decision Trainer
                </Link>
              )}
              {user && isAdmin && (
                <Link
                  href="/admin"
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive('/admin') || pathname.startsWith('/admin') ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              {/* Mobile Language Switcher */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">{t('nav.language')}</span>
                </div>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    language === 'en' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'
                  }`}
                >
                  <span className="font-semibold">English</span>
                  {language === 'en' && <Check className="w-4 h-4 text-primary" />}
                </button>
                <button
                  onClick={() => handleLanguageChange('sq')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    language === 'sq' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground/80 hover:bg-primary/5 hover:text-foreground'
                  }`}
                >
                  <span className="font-semibold">Shqip</span>
                  {language === 'sq' && <Check className="w-4 h-4 text-primary" />}
                </button>
              </div>
              
              <div className="h-px bg-border/40 my-3"></div>
              {authLoading ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : user ? (
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-start border-border/50 hover:border-primary/50">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start hover:bg-primary/10 hover:text-primary">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.login')}
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="w-full justify-start shadow-lg shadow-primary/30">
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.getStarted')}
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </nav>
  );
}
