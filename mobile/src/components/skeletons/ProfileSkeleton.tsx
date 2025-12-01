import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../ui/Skeleton';

export function ProfileSkeleton() {
  return (
    <View className="flex-1 bg-slate-50 px-6 pt-4">
       {/* Header */}
       <View className="flex-row justify-between items-center mb-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-20 w-20 rounded-full" />
       </View>

       {/* Card */}
       <Skeleton className="w-full h-40 rounded-3xl mb-8" />

       {/* Tools */}
       <View className="mb-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <View className="space-y-1">
             <Skeleton className="w-full h-16 rounded-t-3xl" />
             <Skeleton className="w-full h-16" />
             <Skeleton className="w-full h-16" />
             <Skeleton className="w-full h-16 rounded-b-3xl" />
          </View>
       </View>

       {/* Socials */}
       <View>
          <Skeleton className="h-4 w-24 mb-2" />
          <View className="space-y-1">
             <Skeleton className="w-full h-16 rounded-t-3xl" />
             <Skeleton className="w-full h-16" />
             <Skeleton className="w-full h-16 rounded-b-3xl" />
          </View>
       </View>
    </View>
  );
}

