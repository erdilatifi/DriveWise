import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useCategory } from '../../contexts/CategoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { usePersonalizedStats } from '@drivewise/core';
import { ChevronLeft, BrainCircuit, Lock } from 'lucide-react-native';
import { clsx } from 'clsx';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PersonalizedTestsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedCategory } = useCategory();
  const { user, profile } = useAuth();
  
  const { data: stats, isLoading } = usePersonalizedStats(user?.id, selectedCategory || 'B');
  const isPremium = profile?.is_premium;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#ce76c9" />
      </SafeAreaView>
    );
  }

  const pageCount = stats?.pageCount || 0;
  const totalWrong = stats?.totalWrong || 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#35565f" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#35565f]">Teste të Personalizuara</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* Info Card */}
        <View className="mb-8 rounded-3xl bg-[#e2e3e3] p-6 relative overflow-hidden">
           <View className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#ce76c9]/10" />
           
           <View className="flex-row items-start justify-between">
             <View>
               <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">PYETJE TË GABUARA</Text>
               <Text className="text-4xl font-extrabold text-[#35565f]">{totalWrong}</Text>
             </View>
             <View className="h-12 w-12 rounded-full bg-white items-center justify-center">
               <BrainCircuit size={24} color="#ce76c9" />
             </View>
           </View>
           
           <Text className="mt-4 text-sm text-gray-600 leading-5">
             Këto teste krijohen automatikisht nga pyetjet që keni gabuar në testet e kaluara. 
             Sapo t'i përgjigjeni saktë, ato do të hiqen nga kjo listë.
           </Text>
        </View>

        {/* Tests List */}
        {!isPremium ? (
           <View className="items-center justify-center py-10">
              <Lock size={48} color="#ce76c9" />
              <Text className="mt-4 text-lg font-bold text-[#35565f] text-center">
                Kjo veçori është vetëm për Premium
              </Text>
              <Text className="mt-2 text-sm text-gray-500 text-center px-4">
                Abonohuni për të praktikuar pyetjet e gabuara dhe për të përmirësuar rezultatin tuaj.
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Subscription')}
                className="mt-6 bg-[#ce76c9] px-8 py-3 rounded-full shadow-lg shadow-purple-500/30"
              >
                <Text className="text-white font-bold">Bëhu Premium</Text>
              </TouchableOpacity>
           </View>
        ) : pageCount === 0 ? (
           <View className="items-center justify-center py-10">
              <Text className="text-lg font-semibold text-gray-400 text-center">
                Nuk keni pyetje të gabuara momentalisht!
              </Text>
              <Text className="mt-2 text-sm text-gray-400 text-center">
                Vazhdoni të bëni teste normale.
              </Text>
           </View>
        ) : (
           <View className="gap-4">
             {Array.from({ length: pageCount }).map((_, i) => (
               <TouchableOpacity
                 key={i}
                 onPress={() => navigation.navigate('TestRunner', { 
                   testId: `personalized-${i + 1}`, 
                   category: selectedCategory || 'B' 
                 })}
                 className="flex-row items-center bg-white border border-gray-200 p-4 rounded-2xl shadow-sm active:bg-gray-50"
               >
                 <View className="h-10 w-10 rounded-full bg-[#e2e3e3] items-center justify-center mr-4">
                   <Text className="font-bold text-[#35565f]">{i + 1}</Text>
                 </View>
                 <View className="flex-1">
                   <Text className="text-lg font-bold text-[#35565f]">Testi i Personalizuar {i + 1}</Text>
                   <Text className="text-xs text-gray-500">30 Pyetje nga gabimet tuaja</Text>
                 </View>
                 <ChevronLeft size={20} color="#ce76c9" style={{ transform: [{ rotate: '180deg' }] }} />
               </TouchableOpacity>
             ))}
           </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};


