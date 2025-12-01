import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const LoadingScreen = () => {
  return (
    <View className="flex-1 bg-slate-950 items-center justify-center">
       <LinearGradient
          colors={['#1e1b4b', '#020617']}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
       />
       
       <View className="h-24 w-24 rounded-3xl bg-white/10 items-center justify-center mb-8 border border-white/20 shadow-2xl shadow-purple-500/20 backdrop-blur-xl">
          <Text className="text-4xl font-black text-white">DW</Text>
       </View>

       <ActivityIndicator size="large" color="#a855f7" className="mb-4" />
       
       <Text className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
          Duke ngarkuar...
       </Text>
    </View>
  );
};

