import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '../ui/Skeleton';

export function MaterialsSkeleton() {
  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header Card */}
        <View className="px-6 pt-8 pb-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] mb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Skeleton className="h-3 w-20 mb-2 rounded" />
              <Skeleton className="h-8 w-32 rounded" />
            </View>
            <Skeleton className="h-8 w-28 rounded-full" />
          </View>
        </View>

        {/* Signs Card */}
        <View className="px-6 mb-6">
          <Skeleton className="w-full h-20 rounded-2xl" />
        </View>

        {/* Chapters List */}
        <View className="px-6">
          <Skeleton className="h-5 w-24 mb-3 rounded" />
          <View className="gap-4">
            <Skeleton className="w-full h-24 rounded-2xl" />
            <Skeleton className="w-full h-24 rounded-2xl" />
            <Skeleton className="w-full h-24 rounded-2xl" />
            <Skeleton className="w-full h-24 rounded-2xl" />
            <Skeleton className="w-full h-24 rounded-2xl" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

