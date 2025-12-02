import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '../ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <View className="flex-1 bg-[#F7F8FA] dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header Card */}
        <View className="px-6 pt-8 pb-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px]">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Skeleton className="h-3 w-24 mb-2 rounded" />
              <Skeleton className="h-8 w-40 rounded" />
            </View>
            <Skeleton className="h-12 w-12 rounded-full" />
          </View>

          {/* Stats Grid */}
          <View className="flex-row gap-3">
            <Skeleton className="flex-1 h-24 rounded-3xl" />
            <Skeleton className="flex-1 h-24 rounded-3xl" />
            <Skeleton className="flex-1 h-24 rounded-3xl" />
          </View>
        </View>

        {/* Progress Section */}
        <View className="px-6 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-5 w-5 rounded" />
          </View>
          <Skeleton className="w-full h-40 rounded-2xl" />
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-8">
          <Skeleton className="h-5 w-28 mb-3 rounded" />
          <Skeleton className="w-full h-28 rounded-3xl mb-3" />
          <Skeleton className="w-full h-28 rounded-3xl" />
        </View>

        {/* Tests Grid */}
        <View className="px-6 mt-10">
          <View className="flex-row items-center justify-between mb-3">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </View>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            <Skeleton className="w-[48%] h-32 rounded-3xl" />
            <Skeleton className="w-[48%] h-32 rounded-3xl" />
            <Skeleton className="w-[48%] h-32 rounded-3xl" />
            <Skeleton className="w-[48%] h-32 rounded-3xl" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

