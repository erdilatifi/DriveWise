import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMaterials, useUserPlans } from '@drivewise/core';
import { useCategory } from '@/contexts/CategoryContext';
import { BookOpen, Lock, ChevronRight, PlayCircle, AlertTriangle } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { LiteratureStackParamList } from '@/navigation/LiteratureNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialsSkeleton } from '@/components/skeletons/MaterialsSkeleton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList & LiteratureStackParamList>;

// DESIGN TOKENS
const PRIMARY = "#4f46e5";
const BG_COLOR = "#F7F8FA";

export const MaterialsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedCategory } = useCategory();
  const { user, profile } = useAuth();
  const { data, isLoading } = useMaterials({ 
    category: (selectedCategory || 'B') as any, 
    pageSize: 100,
    fields: 'id,title,is_published,order_index,chapter_id' 
  });
  const { data: plans } = useUserPlans(user?.id);

  const hasCategoryAccess = useMemo(() => {
    if (profile?.is_admin) return true;
    return (plans || []).some(p => p.category === (selectedCategory || 'B') && p.status === 'active');
  }, [plans, selectedCategory, profile]);

  if (isLoading) {
    return <MaterialsSkeleton />;
  }

  // Empty State
  if (!data || !data.materials || data.materials.length === 0) {
    return (
      <View className="flex-1 bg-white dark:bg-slate-950">
        <SafeAreaView className="flex-1" edges={['top']}>
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
             <View className="px-6 pt-8 pb-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] mb-6">
                <View className="flex-row items-center justify-between mb-6">
                   <View>
                     <Text className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Materialet</Text>
                     <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">Literatura</Text>
                   </View>
                   <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full px-3 py-1.5">
                      <Text className="font-bold text-slate-700 dark:text-slate-300 text-xs">Kategoria {selectedCategory || 'B'}</Text>
                   </View>
                </View>
             </View>
             <View className="px-6 items-center justify-center py-10">
                <Text className="text-slate-400 dark:text-slate-500 font-medium">Nuk u gjetën materiale për këtë kategori.</Text>
             </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 120 }} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="px-6 pt-8 pb-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] mb-6">
            <View className="flex-row items-center justify-between mb-6">
               <View>
                 <Text className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    Materialet
                 </Text>
                 <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    Literatura
                 </Text>
               </View>
               <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full px-3 py-1.5">
                  <Text className="font-bold text-slate-700 dark:text-slate-300 text-xs">Kategoria {selectedCategory}</Text>
               </View>
            </View>

            {/* Signs Card */}
            <Animated.View entering={FadeInDown.delay(50).springify()}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('SignsCategory')}
                className="relative overflow-hidden rounded-[28px] bg-slate-900 shadow-lg shadow-slate-200 dark:shadow-none"
              >
                <LinearGradient
                  colors={['#1e293b', '#0f172a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="absolute inset-0"
                />
                <View className="p-6 flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <View className="bg-indigo-500/20 self-start px-2 py-1 rounded-md border border-indigo-500/30 mb-2">
                       <Text className="text-indigo-300 text-[10px] font-bold uppercase tracking-wider">Thelbësore</Text>
                    </View>
                    <Text className="text-white text-xl font-bold mb-1">Shenjat e Trafikut</Text>
                    <Text className="text-slate-400 text-xs leading-5">
                      Mësoni kuptimin e të gjitha shenjave rrugore.
                    </Text>
                  </View>
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/10">
                    <AlertTriangle size={24} color="#fbbf24" />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Content List */}
          <View className="px-6 space-y-3">
            {data?.materials.map((material, index) => {
              const isLocked = !hasCategoryAccess && (material.chapter_id > 1);
              
              return (
                <Animated.View 
                  key={material.id}
                  entering={FadeInDown.delay(index * 100).springify()}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      if (isLocked) {
                        navigation.navigate('Subscription');
                      } else {
                        navigation.navigate('MaterialDetail', { materialId: material.id, title: material.title });
                      }
                    }}
                    className={clsx(
                      "flex-row items-center p-4 rounded-2xl border",
                      isLocked 
                        ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-80" 
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-100 dark:shadow-none"
                    )}
                  >
                    {/* Chapter Number */}
                    <View className={clsx(
                       "h-10 w-10 items-center justify-center rounded-xl mr-4",
                       isLocked ? "bg-slate-50 dark:bg-slate-800" : "bg-indigo-50 dark:bg-indigo-900/30"
                    )}>
                       {isLocked ? (
                          <Lock size={16} color="#94a3b8" />
                       ) : (
                          <Text className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{index + 1}</Text>
                       )}
                    </View>
                    
                    {/* Content */}
                    <View className="flex-1">
                       <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-0.5">
                          Kapitulli {material.chapter_id}
                       </Text>
                       <Text 
                         className={clsx(
                           "text-sm font-semibold",
                           isLocked ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-white"
                         )}
                         numberOfLines={1}
                       >
                         {material.title}
                       </Text>
                    </View>

                    {/* Action */}
                    {!isLocked && (
                       <ChevronRight size={18} color="#cbd5e1" />
                    )}
                    {isLocked && (
                       <View className="bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-100 dark:border-amber-900/30">
                          <Text className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase">Premium</Text>
                       </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

