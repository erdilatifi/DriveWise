import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '../ui/Skeleton';

export function ProfileSkeleton() {
  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header Profile Section */}
        <View className="items-center pt-8 pb-8 px-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px]">
          <Skeleton className="h-24 w-24 rounded-full mb-4" />
          <Skeleton className="h-6 w-40 mb-2 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
        </View>

        {/* Menu Sections */}
        <View className="px-6 mt-6">
          {/* Section 1 */}
          <Skeleton className="h-4 w-28 mb-3 rounded" />
          <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-6">
            <Skeleton className="w-full h-14" />
            <View className="h-px bg-slate-100 dark:bg-slate-800" />
            <Skeleton className="w-full h-14" />
            <View className="h-px bg-slate-100 dark:bg-slate-800" />
            <Skeleton className="w-full h-14" />
          </View>

          {/* Section 2 */}
          <Skeleton className="h-4 w-32 mb-3 rounded" />
          <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-6">
            <Skeleton className="w-full h-14" />
            <View className="h-px bg-slate-100 dark:bg-slate-800" />
            <Skeleton className="w-full h-14" />
            <View className="h-px bg-slate-100 dark:bg-slate-800" />
            <Skeleton className="w-full h-14" />
          </View>

          {/* Section 3 */}
          <Skeleton className="h-4 w-36 mb-3 rounded" />
          <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <Skeleton className="w-full h-14" />
            <View className="h-px bg-slate-100 dark:bg-slate-800" />
            <Skeleton className="w-full h-14" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

