import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';
import { useDecisionTrainerStats, useLeaderboard, useUserPlans } from '@drivewise/core';
import { Button } from '@/components/ui/Button';
import { Play, Trophy, Target, Zap, Flame, Crown } from 'lucide-react-native';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { DecisionTrainerSkeleton } from '@/components/skeletons/DecisionTrainerSkeleton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// DESIGN TOKENS
const PRIMARY = "#4f46e5";
const BG_COLOR = "#F7F8FA";

export const DecisionTrainerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, profile } = useAuth();
  const { selectedCategory } = useCategory();
  const { data: stats, isLoading: statsLoading } = useDecisionTrainerStats(user?.id);
  const { data: leaderboardData } = useLeaderboard(user?.id);
  const { data: plans } = useUserPlans(user?.id);

  const isPremium = React.useMemo(() => {
    if (profile?.is_admin || profile?.is_premium) return true;
    return (plans || []).some(p => p.category === (selectedCategory || 'B') && p.status === 'active');
  }, [plans, selectedCategory, profile]);

  if (user && statsLoading) {
    return <DecisionTrainerSkeleton />;
  }

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-8 pb-8 bg-white border-b border-slate-100 rounded-b-[32px] mb-6">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trajneri</Text>
                <Text className="text-3xl font-extrabold text-slate-900">Luaj & Mëso</Text>
              </View>
              <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5">
                <Text className="mr-1.5 text-xs font-bold text-slate-700">Kategoria {selectedCategory}</Text>
                <Trophy size={14} color={PRIMARY} />
              </View>
            </View>

            {/* Main Hero Card */}
            <View className="relative overflow-hidden rounded-[28px] shadow-sm shadow-indigo-200/50">
              <LinearGradient
                colors={[PRIMARY, '#4338ca']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              
              {/* Background Accents */}
              <View className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
              <View className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10" />

              <View className="p-8 items-center">
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-white/20 border border-white/20 backdrop-blur-md">
                  <Zap size={32} color="white" fill="white" />
                </View>
                
                <Text className="mb-2 text-center text-2xl font-bold text-white">
                  Trajnim i Shpejtë
                </Text>
                <Text className="mb-8 text-center text-indigo-100 text-sm leading-5 max-w-[240px]">
                  Merr vendime të shpejta në situata reale trafiku për të përmirësuar reagimin.
                </Text>

                {isPremium ? (
                   <TouchableOpacity
                     activeOpacity={0.9}
                     onPress={() => navigation.navigate('DecisionScenarios', { category: selectedCategory || 'B' })}
                     className="w-full bg-white py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-black/10 active:scale-[0.98] transition-all"
                   >
                      <Play size={20} color={PRIMARY} fill={PRIMARY} className="mr-2" />
                      <Text className="text-indigo-900 font-bold text-base">Fillo Lojën</Text>
                   </TouchableOpacity>
                ) : (
                   <TouchableOpacity
                     activeOpacity={0.9}
                     onPress={() => navigation.navigate('Subscription')}
                     className="w-full bg-indigo-900/40 border border-white/30 py-4 rounded-2xl flex-row items-center justify-center active:bg-indigo-900/50"
                   >
                      <Crown size={18} color="white" className="mr-2" />
                      <Text className="text-white font-bold text-base">Hape me Premium</Text>
                   </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Stats Grid (Minimal 3-col) */}
          <View className="px-6 mb-8">
            <Text className="mb-4 text-base font-bold text-slate-900 px-1">Statistikat</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <Target size={20} color={PRIMARY} className="mb-2" />
                <Text className="text-2xl font-bold text-slate-900">{stats?.totalCorrect || 0}</Text>
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Sakte</Text>
              </View>

              <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <Flame size={20} color="#f59e0b" className="mb-2" />
                <Text className="text-2xl font-bold text-slate-900">{stats?.bestStreak || 0}</Text>
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-1">Seria</Text>
              </View>

              <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <Zap size={20} color="#ef4444" className="mb-2" />
                <Text className="text-2xl font-bold text-slate-900">{stats?.totalXp || 0}</Text>
                <Text className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-1">XP</Text>
              </View>
            </View>
          </View>

          {/* Leaderboard (Minimal List) */}
          <View className="px-6">
            <View className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-base font-bold text-slate-900">Top Lojtarët</Text>
                <Text className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                   Këtë javë
                </Text>
              </View>
              
              {leaderboardData?.topTen.map((entry, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                return (
                  <View key={entry.user_id} className="flex-row items-center py-3 border-b border-slate-50 last:border-0">
                    <View className={clsx(
                       "w-8 h-8 items-center justify-center rounded-full mr-3",
                       isTop3 ? "bg-indigo-50" : "bg-slate-50"
                    )}>
                       <Text className={clsx(
                         "font-bold text-sm", 
                         isTop3 ? "text-indigo-600" : "text-slate-500"
                       )}>{rank}</Text>
                    </View>
                    
                    <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-slate-100 border border-white shadow-sm">
                      <Text className="text-xs font-bold text-slate-600">{entry.full_name.charAt(0)}</Text>
                    </View>
                    
                    <Text className="flex-1 text-sm font-medium text-slate-700" numberOfLines={1}>
                       {entry.full_name}
                    </Text>
                    
                    <View className="flex-row items-center bg-slate-50 px-2 py-1 rounded-lg">
                       <Zap size={12} color="#f59e0b" className="mr-1" />
                       <Text className="font-bold text-xs text-slate-900">{entry.total_xp}</Text>
                    </View>
                  </View>
                );
              })}

              {(!leaderboardData?.topTen || leaderboardData.topTen.length === 0) && (
                <View className="py-8 items-center">
                   <Text className="text-slate-400 text-sm">Bëhu i pari në tabelë!</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

