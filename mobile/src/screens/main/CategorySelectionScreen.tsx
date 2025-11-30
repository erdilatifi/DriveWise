import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useCategory } from '../../contexts/CategoryContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, Bike, Truck, ChevronRight, Info, Bus, CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { clsx } from 'clsx';

// DESIGN TOKENS
const PRIMARY = "#4f46e5";
const BG_COLOR = "#F7F8FA";

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
  const { selectedCategory, setCategory } = useCategory();
  const navigation = useNavigation<any>();

  const handleSelect = (id: string) => {
    setCategory(id);
  };

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 120 }} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-8 pb-8 bg-white border-b border-slate-100 rounded-b-[32px] mb-6">
            <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Mirësevini në DriveWise
            </Text>
            <Text className="text-3xl font-extrabold text-slate-900 leading-tight">
              Zgjidhni
              <Text style={{ color: PRIMARY }}> Kategorinë</Text>
            </Text>
          </View>

          <View className="px-6 gap-5">
            {CATEGORIES.map((cat, index) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <Animated.View 
                  key={cat.id}
                  entering={FadeInDown.delay(index * 100).springify()}
                >
                  <TouchableOpacity
                    onPress={() => handleSelect(cat.id)}
                    activeOpacity={0.9}
                    className={clsx(
                      "rounded-3xl overflow-hidden border transition-all",
                      isSelected ? "border-indigo-600 shadow-md shadow-indigo-100" : "border-slate-100 shadow-sm shadow-slate-100 bg-white"
                    )}
                  >
                    {/* Gradient Header Bar if selected */}
                    {isSelected && (
                      <LinearGradient
                        colors={[PRIMARY, '#6366f1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-1.5 w-full"
                      />
                    )}
                    
                    <View className={clsx("p-5 flex-row items-start", isSelected ? "bg-indigo-50/30" : "bg-white")}>
                      <View className="flex-1 pr-4">
                        <View className="flex-row items-center mb-2">
                          <View className={clsx(
                             "px-2.5 py-1 rounded-lg mr-2",
                             isSelected ? "bg-indigo-100" : "bg-slate-100"
                          )}>
                            <Text className={clsx(
                               "text-xs font-bold",
                               isSelected ? "text-indigo-700" : "text-slate-600"
                            )}>{cat.id}</Text>
                          </View>
                          <Text className="text-lg font-bold text-slate-900">
                            {cat.subtitle}
                          </Text>
                        </View>
                        
                        <Text className="text-slate-500 text-sm leading-5 mb-4">
                          {cat.description}
                        </Text>

                        <View className="flex-row items-center">
                          {isSelected ? (
                             <View className="flex-row items-center">
                                <CheckCircle2 size={16} color={PRIMARY} className="mr-1" />
                                <Text style={{ color: PRIMARY }} className="text-sm font-bold">
                                  E Zgjedhur
                                </Text>
                             </View>
                          ) : (
                             <View className="flex-row items-center">
                                <Text className="text-sm font-bold text-slate-400 mr-1">
                                  Zgjidh
                                </Text>
                                <ChevronRight size={14} color="#94a3b8" />
                             </View>
                          )}
                        </View>
                      </View>

                      <View className="justify-center">
                        <View 
                          style={{ backgroundColor: isSelected ? '#e0e7ff' : cat.accent }}
                          className="h-16 w-16 rounded-2xl items-center justify-center"
                        >
                          {/* @ts-ignore */}
                          <cat.icon size={32} color={isSelected ? PRIMARY : cat.iconColor} strokeWidth={1.5} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}

            <View className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex-row items-start">
              <Info size={20} color="#64748b" className="mt-0.5" />
              <Text className="ml-3 text-slate-500 text-xs flex-1 leading-5">
                Kategoritë përcaktojnë llojin e pyetjeve dhe simulimeve që do të shihni. Mund ta ndryshoni kategorinë në çdo kohë.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

