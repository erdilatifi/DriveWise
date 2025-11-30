import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, CreditCard, FileQuestion, Settings, ChevronRight, TrendingUp, Shield } from 'lucide-react-native';
import { clsx } from 'clsx';

// DESIGN TOKENS
const PRIMARY = "#4f46e5";
const BG_COLOR = "#F7F8FA";

export const AdminDashboardScreen = () => {
  const stats = [
    { label: 'Përdoruesit', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Premium', value: '456', icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Pyetjet', value: '2,500', icon: FileQuestion, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ];

  const menuItems = [
    { title: 'Menaxho Përdoruesit', icon: Users, color: 'bg-slate-50', iconColor: '#64748b', action: () => Alert.alert("Së shpejti", "Menaxhimi i përdoruesve do të jetë i disponueshëm së shpejti.") },
    { title: 'Menaxho Abonimet', icon: CreditCard, color: 'bg-slate-50', iconColor: '#64748b', action: () => Alert.alert("Së shpejti", "Menaxhimi i abonimeve do të jetë i disponueshëm së shpejti.") },
    { title: 'Menaxho Pyetjet', icon: FileQuestion, color: 'bg-slate-50', iconColor: '#64748b', action: () => Alert.alert("Së shpejti", "Menaxhimi i pyetjeve do të jetë i disponueshëm së shpejti.") },
    { title: 'Cilësimet e Platformës', icon: Settings, color: 'bg-slate-50', iconColor: '#64748b', action: () => Alert.alert("Së shpejti", "Cilësimet do të jenë të disponueshme së shpejti.") },
  ];

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-8 pb-8 bg-white border-b border-slate-100 rounded-b-[32px] mb-6">
            <View className="flex-row items-center justify-between">
               <View>
                 <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Paneli
                 </Text>
                 <Text className="text-3xl font-extrabold text-slate-900">
                    Admin
                 </Text>
               </View>
               <View className="h-12 w-12 rounded-full bg-slate-50 items-center justify-center border border-slate-100 shadow-sm">
                  <Shield size={24} color={PRIMARY} />
               </View>
            </View>
          </View>

          {/* Content Container */}
          <View className="px-6">
            {/* Stats Grid */}
            <View className="flex-row flex-wrap justify-between mb-8">
              {stats.map((stat, index) => (
                <View key={index} className={clsx("w-[31%] bg-white p-4 rounded-3xl border border-slate-100 items-center shadow-sm")}>
                  <View className={clsx("h-10 w-10 rounded-2xl items-center justify-center mb-3 border", stat.bg, stat.border)}>
                    {/* @ts-ignore */}
                    <stat.icon size={20} className={stat.color} />
                  </View>
                  <Text className="text-lg font-bold text-slate-900">{stat.value}</Text>
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Main Menu */}
            <View className="mb-8">
              <Text className="text-sm font-bold text-slate-900 mb-4 px-1">
                Menaxhimi
              </Text>
              <View className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={item.action}
                    className={clsx(
                      "flex-row items-center p-4 bg-white active:bg-slate-50",
                      index !== menuItems.length - 1 && "border-b border-slate-50"
                    )}
                    activeOpacity={0.7}
                  >
                    <View className={clsx("h-10 w-10 rounded-xl items-center justify-center mr-4", item.color)}>
                      {/* @ts-ignore */}
                      <item.icon size={20} color={item.iconColor} />
                    </View>
                    <Text className="flex-1 text-[15px] font-semibold text-slate-700">
                      {item.title}
                    </Text>
                    <ChevronRight size={18} color="#cbd5e1" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Activity */}
            <View>
              <Text className="text-sm font-bold text-slate-900 mb-4 px-1">
                Aktiviteti i fundit
              </Text>
              <View className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm space-y-4">
                 <View className="flex-row items-start">
                    <View className="mt-0.5 bg-emerald-50 p-1.5 rounded-lg mr-3">
                       <TrendingUp size={14} color="#10B981" />
                    </View>
                    <View className="flex-1">
                       <Text className="text-xs text-slate-500 leading-5">
                          <Text className="font-bold text-slate-900">User #1234</Text> bleu pakon Premium
                       </Text>
                       <Text className="text-[10px] text-slate-400 mt-1">2 minuta më parë</Text>
                    </View>
                 </View>
                 
                 <View className="h-px bg-slate-50" />

                 <View className="flex-row items-start">
                    <View className="mt-0.5 bg-blue-50 p-1.5 rounded-lg mr-3">
                       <TrendingUp size={14} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                       <Text className="text-xs text-slate-500 leading-5">
                          <Text className="font-bold text-slate-900">User #5678</Text> përfundoi testin me 100%
                       </Text>
                       <Text className="text-[10px] text-slate-400 mt-1">15 minuta më parë</Text>
                    </View>
                 </View>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
