import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategory } from '@/contexts/CategoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats, useTestCount, useUserPlans, useWeakTopics, useGlobalDailyStreak } from '@drivewise/core';
import { Lock, Star, ChevronLeft, Bike, Car, Truck, Target, Trophy, Zap, Activity, AlertCircle, TrendingUp, PlayCircle, CheckCircle2, BookOpen, BrainCircuit, FileText, LogIn } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import Animated, { FadeInDown } from 'react-native-reanimated';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'App'>;

const { width } = Dimensions.get('window');

export const TestsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedCategory, setCategory } = useCategory();
  const { user, profile } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats(user?.id);
  const { data: weakTopicsData } = useWeakTopics(user?.id);
  const { data: globalStreak } = useGlobalDailyStreak(user?.id);
  const { data: testCount = 30 } = useTestCount(selectedCategory || 'B');
  const { data: plans } = useUserPlans(user?.id);

  // Check if user has premium access for the selected category
  const hasCategoryAccess = useMemo(() => {
    if (profile?.is_admin) return true;
    return (plans || []).some(p => p.category === (selectedCategory || 'B') && p.status === 'active');
  }, [plans, selectedCategory, profile]);

  // Ensure we have a valid count
  const validTestCount = (testCount && testCount > 0) ? testCount : 30;

  // Mock tests generation
  const tests = useMemo(() => {
    return Array.from({ length: validTestCount }).map((_, i) => {
      const testNum = i + 1;
      const isLocked = !hasCategoryAccess && testNum > 1; // First test free
      return {
        id: testNum.toString(),
        name: `Testi ${testNum} (2025)`,
        isLocked,
        passed: false // We could check if passed if we had that data map
      };
    });
  }, [validTestCount, hasCategoryAccess]);

  if (user && statsLoading) {
    return <DashboardSkeleton />;
  }

  const dashboardStats = stats?.stats || {
    totalTests: 0,
    averageScore: 0,
    streak: 0,
    passedTests: 0,
    failedTests: 0
  };

  const progressData = stats?.progressData || []; // { date: string, score: number }

  const isGuest = !user;

  const GuestGuide = () => (
    <View className="px-6 pt-6 pb-8 bg-white border-b border-slate-100">
      <View className="mb-8">
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
          Mirësevini në DriveWise
        </Text>
        <Text className="text-3xl font-extrabold text-slate-900 leading-tight">
          Rruga juaj drejt <Text className="text-blue-600">Lejes</Text>
        </Text>
        <Text className="text-slate-500 mt-2 text-base">
          Ndiqni këto hapa për të garantuar suksesin tuaj.
        </Text>
      </View>

      {/* Process Steps */}
      <View className="relative flex-row justify-between items-start px-2">
        {/* Dashed Line Background */}
        <View className="absolute top-7 left-6 right-6 h-[2px] z-0">
           <LinearGradient
             colors={['#3b82f6', '#9333ea']}
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 0 }}
             className="w-full h-full opacity-20"
           />
           {/* Dashed Mask */}
           <View className="absolute inset-0 flex-row justify-between w-full overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <View key={i} className="w-2 h-full bg-white" style={{ marginLeft: 4 }} />
              ))}
           </View>
        </View>

        {/* Step 1: Literatura */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Literatura' as any)}
          className="items-center z-10 w-1/3"
        >
          <View className="h-14 w-14 rounded-2xl bg-blue-50 items-center justify-center border-2 border-blue-100 mb-3 shadow-sm">
            {/* @ts-ignore */}
            <BookOpen size={24} color="#2563eb" />
          </View>
          <Text className="text-sm font-bold text-slate-900 mb-1">Literatura</Text>
          <Text className="text-[10px] text-slate-500 text-center leading-3">Mësoni rregullat</Text>
        </TouchableOpacity>

        {/* Step 2: Trajneri */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Trajneri' as any)}
          className="items-center z-10 w-1/3"
        >
          <View className="h-14 w-14 rounded-2xl bg-purple-50 items-center justify-center border-2 border-purple-100 mb-3 shadow-sm">
            {/* @ts-ignore */}
            <BrainCircuit size={24} color="#9333ea" />
          </View>
          <Text className="text-sm font-bold text-slate-900 mb-1">Trajneri</Text>
          <Text className="text-[10px] text-slate-500 text-center leading-3">Ushtroni pyetjet</Text>
        </TouchableOpacity>

        {/* Step 3: Testet */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Testet' as any)}
          className="items-center z-10 w-1/3"
        >
          <View className="h-14 w-14 rounded-2xl bg-emerald-50 items-center justify-center border-2 border-emerald-100 mb-3 shadow-sm">
            {/* @ts-ignore */}
            <FileText size={24} color="#10b981" />
          </View>
          <Text className="text-sm font-bold text-slate-900 mb-1">Testet</Text>
          <Text className="text-[10px] text-slate-500 text-center leading-3">Simulimi final</Text>
        </TouchableOpacity>
      </View>

      {/* CTA */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.getParent()?.navigate('Login')}
        className="mt-8 bg-slate-900 py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-slate-200"
      >
        {/* @ts-ignore */}
        <LogIn size={20} color="white" className="mr-2" />
        <Text className="text-white font-bold text-base">Hyni në llogari për të ruajtur progresin</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          
          {/* Header & Greeting OR Guest Guide */}
          {isGuest ? (
            <GuestGuide />
          ) : (
            <View className="px-6 pt-4 pb-6 bg-white border-b border-slate-100">
               <View className="flex-row items-center justify-between mb-6">
                 <View>
                   <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mirësevini</Text>
                   <Text className="text-2xl font-extrabold text-slate-900">{profile?.full_name || "Përdorues"}</Text>
                 </View>
                 <View className="h-12 w-12 rounded-full bg-[#1e1b4b] items-center justify-center shadow-md shadow-blue-200">
                    <Text className="text-xl font-bold text-white">{profile?.full_name?.charAt(0) || "U"}</Text>
                 </View>
               </View>

               {/* Stats Grid */}
               <View className="flex-row gap-3">
                  <View className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                     <View className="flex-row items-center mb-2">
                        <View className="bg-amber-100 p-1.5 rounded-lg mr-2">
                          {/* @ts-ignore */}
                          <Target size={14} color="#d97706" />
                        </View>
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mesatarja</Text>
                     </View>
                     <Text className="text-2xl font-black text-slate-900">{dashboardStats.averageScore}%</Text>
                  </View>
                  <View className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                     <View className="flex-row items-center mb-2">
                        <View className="bg-blue-100 p-1.5 rounded-lg mr-2">
                          {/* @ts-ignore */}
                          <CheckCircle2 size={14} color="#2563eb" />
                        </View>
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Testet</Text>
                     </View>
                     <Text className="text-2xl font-black text-slate-900">{dashboardStats.totalTests}</Text>
                  </View>
                  <View className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                     <View className="flex-row items-center mb-2">
                        <View className="bg-red-100 p-1.5 rounded-lg mr-2">
                          {/* @ts-ignore */}
                          <Zap size={14} color="#dc2626" />
                        </View>
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seria</Text>
                     </View>
                     <Text className="text-2xl font-black text-slate-900">{globalStreak?.currentStreak || 0}</Text>
                  </View>
               </View>
            </View>
          )}

          {/* Weekly Progress Chart - Only for Logged In Users */}
          {!isGuest && (
            <View className="px-6 mt-8">
               <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold text-slate-900">Progresi i Javës</Text>
                  {/* @ts-ignore */}
                  <TrendingUp size={20} color="#94a3b8" />
               </View>
               
               <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm h-52">
                  <View className="flex-1 flex-row items-end justify-between gap-3">
                    {progressData.length > 0 ? (
                       progressData.map((item, index) => {
                          const height = Math.max((item.score / 100) * 100, 8); 
                          const isToday = index === progressData.length - 1;
                          return (
                             <Animated.View 
                                key={index} 
                                entering={FadeInDown.delay(index * 100).springify()}
                                className="items-center flex-1 gap-2"
                             >
                                <View className="w-full h-32 bg-slate-50 rounded-xl relative flex-col-reverse overflow-hidden">
                                   <LinearGradient
                                      colors={isToday ? ['#3b82f6', '#1e1b4b'] : ['#cbd5e1', '#94a3b8']}
                                      className="w-full rounded-xl"
                                      style={{ height: `${height}%` }}
                                   />
                                </View>
                                <Text className={clsx("text-[10px] font-bold", isToday ? "text-[#1e1b4b]" : "text-slate-400")}>
                                  {item.date}
                                </Text>
                             </Animated.View>
                          )
                       })
                    ) : (
                       <View className="flex-1 items-center justify-center">
                          <Text className="text-slate-400 text-sm font-medium">S'ka të dhëna për këtë javë</Text>
                       </View>
                    )}
                  </View>
               </View>
            </View>
          )}

          {/* Quick Actions */}
          <View className="px-6 mt-8 mb-2">
             <Text className="text-lg font-bold text-slate-900 mb-4">Fillo Testim</Text>
             <View className="gap-4">
               <TouchableOpacity 
                  activeOpacity={0.9}
                  onPress={() => navigation.getParent()?.navigate('TestInstructions', { testId: 'random', category: selectedCategory! })}
                  className="shadow-lg shadow-blue-500/20"
               >
                  <LinearGradient
                    colors={['#1e1b4b', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="w-full rounded-3xl py-5 px-6 flex-row items-center justify-between"
                  >
                    <View>
                       <View className="flex-row items-center mb-1">
                          <View className="bg-white/20 p-1 rounded mr-2">
                            {/* @ts-ignore */}
                            <Zap size={12} color="white" fill="white" />
                          </View>
                          <Text className="text-blue-100 text-xs font-bold uppercase tracking-wider">E Rekomanduar</Text>
                       </View>
                       <Text className="text-white font-black text-xl mb-1">Testi i Rastit</Text>
                       <Text className="text-blue-100 text-xs font-medium">30 pyetje nga të gjitha temat</Text>
                    </View>
                    <View className="h-12 w-12 bg-white rounded-full items-center justify-center shadow-sm">
                       {/* @ts-ignore */}
                       <PlayCircle size={28} color="#2563eb" fill="#2563eb" />
                    </View>
                  </LinearGradient>
               </TouchableOpacity>

               <TouchableOpacity 
                  activeOpacity={0.9}
                  onPress={() => {
                      if (!hasCategoryAccess) {
                          navigation.getParent()?.navigate('Subscription');
                      } else {
                          navigation.getParent()?.navigate('TestInstructions', { testId: 'personalized', category: selectedCategory! });
                      }
                  }}
                  className="w-full bg-white border border-slate-200 rounded-3xl py-5 px-6 flex-row items-center justify-between shadow-sm"
               >
                  <View>
                     <View className="flex-row items-center mb-1">
                        <View className="bg-purple-100 p-1 rounded mr-2">
                          {/* @ts-ignore */}
                          <Target size={12} color="#9333ea" />
                        </View>
                        <Text className="text-purple-600 text-xs font-bold uppercase tracking-wider">Inteligjente</Text>
                     </View>
                     <Text className="text-slate-900 font-black text-xl mb-1">Test i Personalizuar</Text>
                     <Text className="text-slate-500 text-xs font-medium">Bazuar në gabimet tuaja</Text>
                  </View>
                  <View className="h-12 w-12 bg-purple-50 rounded-full items-center justify-center border border-purple-100">
                     {/* @ts-ignore */}
                     <Activity size={24} color="#9333ea" />
                  </View>
               </TouchableOpacity>
             </View>
          </View>
  
          {/* All Tests Grid */}
          <View className="px-6 mt-8">
             <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-slate-900">Të gjitha Testet</Text>
                <View className="bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                   <Text className="text-xs font-bold text-slate-600">Kategoria {selectedCategory}</Text>
                </View>
             </View>

             <View className="flex-row flex-wrap justify-between gap-y-4">
                {tests.map((test) => (
                  <TouchableOpacity
                    key={test.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (test.isLocked) {
                        navigation.getParent()?.navigate('Subscription');
                      } else {
                        navigation.getParent()?.navigate('TestInstructions', { testId: test.id, category: selectedCategory! });
                      }
                    }}
                    className="w-[48%] bg-white border border-slate-200 rounded-3xl p-5 shadow-sm"
                  >
                    <View className="flex-row justify-between items-start mb-8">
                       <View className={clsx("h-10 w-10 rounded-xl items-center justify-center", test.isLocked ? "bg-slate-100" : "bg-blue-50")}>
                          <Text className={clsx("text-lg font-black", test.isLocked ? "text-slate-400" : "text-blue-600")}>{test.id}</Text>
                       </View>
                       {test.isLocked && (
                          /* @ts-ignore */
                          <Lock size={16} color="#94a3b8" />
                       )}
                    </View>
                    
                    <View>
                       <Text className="text-slate-900 font-bold text-base mb-1">Testi {test.id}</Text>
                       <View className="flex-row items-center justify-between">
                          <Text className="text-[10px] text-slate-400 font-bold uppercase">2025</Text>
                          {test.isLocked ? (
                             <Text className="text-[10px] font-black text-amber-500">PREMIUM</Text>
                          ) : (
                             <Text className="text-[10px] font-black text-green-500">FALAS</Text>
                          )}
                       </View>
                    </View>
                  </TouchableOpacity>
                ))}
             </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

