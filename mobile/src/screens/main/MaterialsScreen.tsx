import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMaterials, useUserPlans } from '@drivewise/core';
import { useCategory } from '../../contexts/CategoryContext';
import { BookOpen, Lock, ChevronRight, BarChart3, Maximize2, AlertTriangle, Gauge, Circle, User, Box, PlayCircle, FileText } from 'lucide-react-native';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { LiteratureStackParamList } from '../../navigation/LiteratureNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

type NavigationProp = NativeStackNavigationProp<RootStackParamList & LiteratureStackParamList>;
const { width } = Dimensions.get('window');

export const MaterialsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedCategory } = useCategory();
  const { user, profile } = useAuth();
  const { data, isLoading } = useMaterials({ 
    category: selectedCategory as any, 
    pageSize: 100,
    fields: 'id,title,is_published,order_index,chapter_id' 
  });
  const { data: plans } = useUserPlans(user?.id);

  const hasCategoryAccess = useMemo(() => {
    if (profile?.is_admin) return true;
    return (plans || []).some(p => p.category === (selectedCategory || 'B') && p.status === 'active');
  }, [plans, selectedCategory, profile]);

  const getIconForMaterial = (index: number) => {
    const icons = [BookOpen, Gauge, AlertTriangle, BarChart3, Maximize2, Circle, Box, FileText];
    return icons[index % icons.length];
  };

  // Mock progress for UI demo
  const getProgress = (index: number) => {
     if (index === 0) return 75;
     if (index === 1) return 30;
     return 0;
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-slate-400 text-xs font-bold mt-4 tracking-widest uppercase">Duke ngarkuar...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 100 }} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="px-6 pt-4 pb-6 bg-white border-b border-slate-100 mb-6">
            <View className="flex-row items-center justify-between mb-4">
               <View>
                 <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Materialet Mësimore
                 </Text>
                 <Text className="text-3xl font-extrabold text-slate-900">
                    Literatura
                 </Text>
               </View>
               <View className="h-12 w-12 rounded-full bg-blue-50 items-center justify-center border border-blue-100">
                  {/* @ts-ignore */}
                  <BookOpen size={24} color="#2563eb" />
               </View>
            </View>

            <View className="flex-row items-center bg-slate-50 self-start px-3 py-1.5 rounded-lg border border-slate-200">
               <View className="h-2 w-2 rounded-full bg-green-500 mr-2" />
               <Text className="font-bold text-slate-700 text-xs">Kategoria {selectedCategory}</Text>
            </View>
          </View>

          {/* Signs Card */}
          <View className="px-6 mb-6">
            <Animated.View entering={FadeInDown.delay(50).springify()}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('SignsCategory')}
                className="relative overflow-hidden rounded-[24px] bg-slate-900 shadow-lg shadow-slate-300"
              >
                <LinearGradient
                  colors={['#1e293b', '#0f172a']}
                  className="absolute inset-0"
                />
                <View className="p-5 flex-row items-center">
                  <View className="h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/30 mr-4">
                    <AlertTriangle size={28} color="#ef4444" strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-lg font-bold">Shenjat e Trafikut</Text>
                    <Text className="text-slate-400 text-xs mt-1">Mësoni kuptimin e shenjave rrugore</Text>
                  </View>
                  <View className="bg-slate-800 p-2 rounded-full">
                    <ChevronRight size={20} color="#94a3b8" />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Content List */}
          <View className="px-6 space-y-4">
            {data?.materials.map((material, index) => {
              const isLocked = !hasCategoryAccess && (material.chapter_id > 1);
              // Future: Fetch real progress from user_progress table
              const progress = 0; 
              const MaterialIcon = getIconForMaterial(index);

              return (
                <Animated.View 
                  key={material.id}
                  entering={FadeInDown.delay(index * 100).springify()}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      if (isLocked) {
                        navigation.navigate('Subscription');
                      } else {
                        navigation.navigate('MaterialDetail', { materialId: material.id, title: material.title });
                      }
                    }}
                    className={clsx(
                      "relative overflow-hidden rounded-[24px] mb-2 border shadow-sm",
                      isLocked ? "bg-slate-50 border-slate-200" : "bg-white border-slate-100"
                    )}
                    style={!isLocked ? {
                      shadowColor: "#2563eb",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.05,
                      shadowRadius: 12,
                      elevation: 3
                    } : {}}
                  >
                    {/* Selection Indicator for Active Item */}
                    {!isLocked && progress > 0 && (
                        <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
                    )}

                    <View className="p-5 flex-row items-center">
                        {/* Icon Box */}
                        <View className={clsx(
                           "h-14 w-14 items-center justify-center rounded-2xl border mr-4",
                           isLocked 
                             ? "bg-slate-100 border-slate-200" 
                             : "bg-blue-50 border-blue-100"
                        )}>
                           {/* @ts-ignore */}
                           <MaterialIcon 
                             size={24} 
                             color={isLocked ? "#94a3b8" : "#2563eb"} 
                             strokeWidth={1.5} 
                           />
                        </View>
                        
                        {/* Text Content */}
                        <View className="flex-1 pr-2">
                           <View className="flex-row items-center justify-between mb-1">
                              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                 Kapitulli {material.chapter_id}
                              </Text>
                              {isLocked && (
                                 <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                    {/* @ts-ignore */}
                                    <Lock size={10} color="#d97706" className="mr-1" />
                                    <Text className="text-[10px] font-bold text-amber-600">PREMIUM</Text>
                                 </View>
                              )}
                           </View>
                           
                           <Text 
                             className={clsx(
                               "text-lg font-bold mb-2 leading-6",
                               isLocked ? "text-slate-500" : "text-slate-900"
                             )}
                             numberOfLines={2}
                           >
                             {material.title}
                           </Text>

                           {/* Progress Bar */}
                           {!isLocked && progress > 0 && (
                              <View className="flex-row items-center">
                                 <View className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden mr-3">
                                    <View 
                                       className="h-full bg-blue-500 rounded-full" 
                                       style={{ width: `${progress}%` }} 
                                    /> 
                                 </View>
                                 <Text className="text-xs font-bold text-blue-600">{progress}%</Text>
                              </View>
                           )}
                        </View>

                        {/* Action Icon */}
                        <View className="ml-2">
                           {isLocked ? (
                              <View className="bg-slate-100 p-2 rounded-full">
                                 {/* @ts-ignore */}
                                 <Lock size={20} color="#cbd5e1" />
                              </View>
                           ) : (
                              <View className="bg-blue-50 p-2 rounded-full">
                                 {/* @ts-ignore */}
                                 <PlayCircle size={20} color="#2563eb" fill="#dbeafe" />
                              </View>
                           )}
                        </View>
                    </View>
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

