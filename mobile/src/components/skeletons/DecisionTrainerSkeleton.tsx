import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/Skeleton';

export function DecisionTrainerSkeleton() {
  return (
    <View className="flex-1 bg-slate-50 px-6 pt-4">
       {/* Header */}
       <View className="mb-6 flex-row items-center justify-between">
          <View>
             <Skeleton className="h-6 w-32 mb-2" />
             <Skeleton className="h-8 w-48" />
          </View>
          <Skeleton className="h-8 w-24 rounded-full" />
       </View>

       {/* Hero */}
       <Skeleton className="w-full h-80 rounded-3xl mb-8" />

       {/* Stats */}
       <Skeleton className="h-6 w-32 mb-4" />
       <View className="flex-row flex-wrap gap-4 mb-8">
          <Skeleton className="flex-1 h-24 rounded-2xl" />
          <Skeleton className="flex-1 h-24 rounded-2xl" />
       </View>
       <View className="flex-row flex-wrap gap-4 mb-8">
          <Skeleton className="flex-1 h-24 rounded-2xl" />
          <Skeleton className="flex-1 h-24 rounded-2xl" />
       </View>

       {/* Leaderboard */}
       <Skeleton className="w-full h-64 rounded-2xl" />
    </View>
  );
}
