import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '../ui/Skeleton';

export function DecisionTrainerSkeleton() {
  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header Card */}
        <View className="px-6 pt-8 pb-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] mb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Skeleton className="h-3 w-16 mb-2 rounded" />
              <Skeleton className="h-8 w-36 rounded" />
            </View>
            <Skeleton className="h-8 w-28 rounded-full" />
          </View>
        </View>

        {/* Hero Card */}
        <View className="px-6 mb-6">
          <Skeleton className="w-full h-72 rounded-3xl" />
        </View>

        {/* Stats Grid */}
        <View className="px-6 mb-6">
          <Skeleton className="h-5 w-28 mb-3 rounded" />
          <View className="flex-row gap-3 mb-3">
            <Skeleton className="flex-1 h-24 rounded-2xl" />
            <Skeleton className="flex-1 h-24 rounded-2xl" />
          </View>
          <View className="flex-row gap-3">
            <Skeleton className="flex-1 h-24 rounded-2xl" />
            <Skeleton className="flex-1 h-24 rounded-2xl" />
          </View>
        </View>

        {/* Leaderboard */}
        <View className="px-6">
          <Skeleton className="h-5 w-32 mb-3 rounded" />
          <Skeleton className="w-full h-48 rounded-2xl" />
        </View>
      </SafeAreaView>
    </View>
  );
}

