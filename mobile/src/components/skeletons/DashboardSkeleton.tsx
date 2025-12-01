import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <View className="flex-1 bg-slate-50 px-6 pt-12">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
           <Skeleton className="h-4 w-20 mb-2" />
           <Skeleton className="h-8 w-40" />
        </View>
        <Skeleton className="h-12 w-12 rounded-full" />
      </View>

      {/* Stats Grid */}
      <View className="flex-row gap-3 mb-8">
        <Skeleton className="flex-1 h-24 rounded-2xl" />
        <Skeleton className="flex-1 h-24 rounded-2xl" />
        <Skeleton className="flex-1 h-24 rounded-2xl" />
      </View>

      {/* Chart */}
      <Skeleton className="w-full h-52 rounded-3xl mb-8" />

      {/* Quick Actions */}
      <Skeleton className="w-full h-24 rounded-3xl mb-4" />
      
      {/* Grid */}
      <View className="flex-row flex-wrap justify-between gap-y-4">
         <Skeleton className="w-[48%] h-40 rounded-3xl" />
         <Skeleton className="w-[48%] h-40 rounded-3xl" />
         <Skeleton className="w-[48%] h-40 rounded-3xl" />
         <Skeleton className="w-[48%] h-40 rounded-3xl" />
      </View>
    </View>
  );
}

