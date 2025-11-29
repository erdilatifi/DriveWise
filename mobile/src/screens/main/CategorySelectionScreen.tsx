import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useCategory } from '../../contexts/CategoryContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, Bike, Truck, ChevronRight, Info, Bus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { 
    id: 'A', 
    name: 'Kategoria A', 
    title: 'Kategoria A',
    subtitle: 'Motoçikleta',
    description: 'A1: Motoçikletat e lehta që nuk kalon 125cm3.\nA: Motoçikleta deri 25 kw.', 
    icon: Bike, 
    colors: ['#FF6B6B', '#EE5D5D'] as const,
    accent: '#FFE5E5',
    iconColor: '#D93025'
  },
  { 
    id: 'B', 
    name: 'Kategoria B', 
    title: 'Kategoria B',
    subtitle: 'Vetura',
    description: 'Mjetet motorike që nuk tejkalojnë masën 3500kg, me 8 ulëse.', 
    icon: Car, 
    colors: ['#4FACFE', '#00F2FE'] as const,
    accent: '#E0F7FA',
    iconColor: '#0288D1'
  },
  { 
    id: 'C1', 
    name: 'Kategoria C1', 
    title: 'Kategoria C1',
    subtitle: 'Kamionë të Lehtë',
    description: 'Mjetet motorike prej 3500kg deri 7500kg.', 
    icon: Truck, 
    colors: ['#43E97B', '#38F9D7'] as const,
    accent: '#E8F5E9',
    iconColor: '#2E7D32'
  },
  { 
    id: 'C', 
    name: 'Kategoria C', 
    title: 'Kategoria C',
    subtitle: 'Kamionë të Rëndë',
    description: 'Mjetet motorike me mbi 7500 kg.', 
    icon: Truck, 
    colors: ['#a855f7', '#d8b4fe'] as const,
    accent: '#F3E5F5',
    iconColor: '#7B1FA2'
  },
  { 
    id: 'D', 
    name: 'Kategoria D', 
    title: 'Kategoria D',
    subtitle: 'Autobusë',
    description: 'Mjetet motorike për transportin e personave me më shumë se 8 ulëse.', 
    icon: Bus, 
    colors: ['#F59E0B', '#D97706'] as const,
    accent: '#FEF3C7',
    iconColor: '#B45309'
  },
];

export const CategorySelectionScreen = () => {
  const { setCategory } = useCategory();
  const navigation = useNavigation<any>();

  const handleSelect = (id: string) => {
    setCategory(id);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1">
        <View className="px-6 pt-4 pb-2">
          <Text className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-1">
            Mirësevini në DriveWise
          </Text>
          <Text className="text-slate-900 text-3xl font-extrabold leading-tight">
            Zgjidhni
            <Text className="text-[#3b82f6]"> Kategorinë</Text>
          </Text>
        </View>

        <ScrollView 
          contentContainerStyle={{ padding: 24, paddingBottom: 100, gap: 20 }} 
          showsVerticalScrollIndicator={false}
        >
          {CATEGORIES.map((cat, index) => (
            <Animated.View 
              key={cat.id}
              entering={FadeInDown.delay(index * 100).springify()}
            >
              <TouchableOpacity
                onPress={() => handleSelect(cat.id)}
                activeOpacity={0.9}
                className="shadow-sm"
                style={{
                  shadowColor: cat.iconColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 5
                }}
              >
                <View className="bg-white rounded-3xl overflow-hidden border border-slate-100">
                  {/* Gradient Header Bar */}
                  <LinearGradient
                    colors={cat.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-2 w-full"
                  />
                  
                  <View className="p-5 flex-row">
                    <View className="flex-1 pr-4">
                      <View className="flex-row items-center mb-2">
                        <View className="bg-slate-100 px-2 py-1 rounded-md mr-2">
                          <Text className="text-xs font-bold text-slate-600">{cat.id}</Text>
                        </View>
                        <Text className="text-lg font-bold text-slate-800">
                          {cat.subtitle}
                        </Text>
                      </View>
                      
                      <Text className="text-slate-500 text-sm leading-5 mb-3">
                        {cat.description}
                      </Text>

                      <View className="flex-row items-center">
                        <Text style={{ color: cat.iconColor }} className="text-sm font-bold mr-1">
                          Zgjidh
                        </Text>
                        <ChevronRight size={14} color={cat.iconColor} />
                      </View>
                    </View>

                    <View className="justify-center">
                      <View 
                        style={{ backgroundColor: cat.accent }}
                        className="h-20 w-20 rounded-2xl items-center justify-center transform rotate-3"
                      >
                        {/* @ts-ignore */}
                        <cat.icon size={40} color={cat.iconColor} strokeWidth={1.5} />
                      </View>
                    </View>
                  </View>

                  {/* Background Pattern */}
                  <View className="absolute -bottom-10 -left-10 opacity-5 pointer-events-none">
                     {/* @ts-ignore */}
                    <cat.icon size={150} color={cat.iconColor} />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          <View className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex-row items-start">
            <Info size={20} color="#3b82f6" className="mt-0.5" />
            <Text className="ml-3 text-blue-700 text-sm flex-1 leading-5">
              Kategoritë përcaktojnë llojin e pyetjeve dhe simulimeve që do të shihni. Mund ta ndryshoni kategorinë në çdo kohë nga menuja e profilit.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

