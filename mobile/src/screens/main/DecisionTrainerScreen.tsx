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
import { Play, Trophy, Target, Zap, Flame } from 'lucide-react-native';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { DecisionTrainerSkeleton } from '@/components/skeletons/DecisionTrainerSkeleton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Header */}
          <View className="px-6 pt-4 pb-8">
            <View className="mb-6 flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-[#1e1b4b]">Trajneri</Text>
                <Text className="text-2xl font-bold text-slate-900">Luaj & Mëso</Text>
              </View>
              <View className="flex-row items-center rounded-full bg-white border border-slate-200 px-3 py-1 shadow-sm">
                <Text className="mr-1 font-bold text-slate-700">Kat. {selectedCategory}</Text>
                {/* @ts-ignore */}
                <Trophy size={14} color="#1e1b4b" />
              </View>
            </View>

            {/* Main Hero Card */}
            <View className="relative mb-8 overflow-hidden rounded-3xl shadow-xl">
              <LinearGradient
                colors={['#1e1b4b', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              
              {!isPremium && (
                <View className="absolute inset-0 z-10 items-center justify-center bg-black/60 backdrop-blur-sm">
                  <View className="items-center p-6">
                    <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#1e1b4b]">
                       {/* @ts-ignore */}
                       <Target size={32} color="white" />
                    </View>
                    <Text className="mb-2 text-center text-xl font-bold text-white">
                      Vetëm për Premium
                    </Text>
                    <Text className="mb-6 text-center text-gray-200">
                      Ky seksion është i disponueshëm vetëm për anëtarët me paketë aktive.
                    </Text>
                    <Button 
                      label="Bëhu Premium"
                      onPress={() => navigation.navigate('Subscription')}
                      className="bg-[#1e1b4b] w-full px-8 shadow-lg shadow-blue-500/30"
                    />
                  </View>
                </View>
              )}

              <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <View className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
              
              <View className="p-8 items-center">
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                  {/* @ts-ignore */}
                  <Zap size={40} color="white" fill="white" />
                </View>
                
                <Text className="mb-2 text-center text-3xl font-bold text-white">
                  Trajnim i Shpejtë
                </Text>
                <Text className="mb-6 text-center text-white/90">
                  Merr vendime të shpejta në situata reale trafiku.
                </Text>

                <Button 
                  label={isPremium ? "Fillo Lojën" : "Kërkohet Premium"}
                  variant="secondary"
                  className="w-full bg-white"
                  textClassName="text-[#3b82f6] font-bold"
                  onPress={() => isPremium && navigation.navigate('DecisionScenarios', { category: selectedCategory || 'B' })}
                  disabled={!isPremium}
                  // @ts-ignore
                  icon={<Play size={20} className="text-[#3b82f6] mr-2" fill="currentColor" />}
                />
              </View>
            </View>

            {/* Stats Grid */}
            <View className="mb-8">
              <Text className="mb-4 text-lg font-bold text-slate-900">Statistikat Tuaja</Text>
              <View className="flex-row flex-wrap gap-4">
                <View className="flex-1 min-w-[150px] rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                    {/* @ts-ignore */}
                    <Target size={20} color="#1e1b4b" />
                  </View>
                  <Text className="text-2xl font-bold text-slate-900">{stats?.totalCorrect || 0}</Text>
                  <Text className="text-xs text-slate-500">Vendime të sakta</Text>
                </View>

                <View className="flex-1 min-w-[150px] rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                    {/* @ts-ignore */}
                    <Flame size={20} color="#fbbf24" />
                  </View>
                  <Text className="text-2xl font-bold text-slate-900">{stats?.bestStreak || 0}</Text>
                  <Text className="text-xs text-slate-500">Seria më e mirë</Text>
                </View>

                <View className="flex-1 min-w-[150px] rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                    {/* @ts-ignore */}
                    <Zap size={20} color="#ef4444" />
                  </View>
                  <Text className="text-2xl font-bold text-slate-900">{stats?.totalXp || 0}</Text>
                  <Text className="text-xs text-slate-500">XP Total</Text>
                </View>

                <View className="flex-1 min-w-[150px] rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <View className="mb-2 h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                    {/* @ts-ignore */}
                    <Trophy size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-2xl font-bold text-slate-900">{stats?.accuracy || 0}%</Text>
                  <Text className="text-xs text-slate-500">Saktësia</Text>
                </View>
              </View>
            </View>

            {/* Leaderboard */}
            <View className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-slate-900">Tabela e Liderëve</Text>
                <TouchableOpacity>
                  <Text className="text-sm font-bold text-[#1e1b4b]">Top 10</Text>
                </TouchableOpacity>
              </View>
              
              {leaderboardData?.topTen.map((entry, index) => {
                const rank = index + 1;
                return (
                  <View key={entry.user_id} className="flex-row items-center py-3 border-b border-slate-100 last:border-0">
                    <Text className={clsx(
                      "w-8 text-center font-bold", 
                      rank === 1 ? "text-[#1e1b4b]" : "text-gray-500"
                    )}>{rank}</Text>
                    <View className="ml-3 h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                      <Text className="text-xs font-bold text-slate-700">{entry.full_name.charAt(0)}</Text>
                    </View>
                    <Text className="ml-3 flex-1 font-medium text-slate-800" numberOfLines={1}>{entry.full_name}</Text>
                    <Text className="font-bold text-[#1e1b4b]">{entry.total_xp} XP</Text>
                  </View>
                );
              })}

              {(!leaderboardData?.topTen || leaderboardData.topTen.length === 0) && (
                <Text className="text-center text-gray-500 py-4">Asnjë lojtar ende.</Text>
              )}
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

