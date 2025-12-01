import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/Skeleton';

export function MaterialsSkeleton() {
  return (
    <View className="flex-1 bg-slate-50 px-6 pt-4">
       {/* Header */}
       <View className="flex-row items-center justify-between mb-6">
         <View>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-48" />
         </View>
         <Skeleton className="h-12 w-12 rounded-full" />
       </View>

       {/* Signs Card */}
       <Skeleton className="w-full h-24 rounded-[24px] mb-6" />

       {/* List */}
       <View className="space-y-4">
          <Skeleton className="w-full h-24 rounded-[24px]" />
          <Skeleton className="w-full h-24 rounded-[24px]" />
          <Skeleton className="w-full h-24 rounded-[24px]" />
          <Skeleton className="w-full h-24 rounded-[24px]" />
          <Skeleton className="w-full h-24 rounded-[24px]" />
       </View>
    </View>
  );
}

