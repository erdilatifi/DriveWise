import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, CreditCard, FileQuestion, Settings, ChevronRight, TrendingUp } from 'lucide-react-native';
import { clsx } from 'clsx';

export const AdminDashboardScreen = () => {
  const stats = [
    { label: 'Përdoruesit', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { label: 'Premium', value: '456', icon: CreditCard, color: 'bg-orange-500' },
    { label: 'Pyetjet', value: '2,500', icon: FileQuestion, color: 'bg-green-500' },
  ];

  const menuItems = [
    { title: 'Menaxho Përdoruesit', icon: Users, color: 'bg-blue-100', iconColor: '#3B82F6', action: () => Alert.alert("Së shpejti", "Menaxhimi i përdoruesve do të jetë i disponueshëm së shpejti.") },
    { title: 'Menaxho Abonimet', icon: CreditCard, color: 'bg-orange-100', iconColor: '#F97316', action: () => Alert.alert("Së shpejti", "Menaxhimi i abonimeve do të jetë i disponueshëm së shpejti.") },
    { title: 'Menaxho Pyetjet', icon: FileQuestion, color: 'bg-green-100', iconColor: '#22C55E', action: () => Alert.alert("Së shpejti", "Menaxhimi i pyetjeve do të jetë i disponueshëm së shpejti.") },
    { title: 'Cilësimet e Platformës', icon: Settings, color: 'bg-gray-100', iconColor: '#374151', action: () => Alert.alert("Së shpejti", "Cilësimet do të jenë të disponueshme së shpejti.") },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
            PANELI I KONTROLLIT
          </Text>
          <Text className="text-3xl font-extrabold text-slate-900">
            Admin Dashboard
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="px-6 flex-row flex-wrap justify-between mb-8">
          {stats.map((stat, index) => (
            <View key={index} className={clsx("w-[31%] bg-gray-50 p-3 rounded-2xl border border-gray-100 items-center")}>
              <View className={clsx("h-10 w-10 rounded-full items-center justify-center mb-2", stat.color)}>
                {/* @ts-ignore */}
                <stat.icon size={20} color="white" />
              </View>
              <Text className="text-lg font-bold text-slate-900">{stat.value}</Text>
              <Text className="text-[10px] font-semibold text-gray-400 uppercase">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Main Menu */}
        <View className="px-6">
          <Text className="text-sm font-bold text-slate-900 mb-4">
            Menaxhimi
          </Text>
          <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.action}
                className={clsx(
                  "flex-row items-center p-4 bg-white",
                  index !== menuItems.length - 1 && "border-b border-gray-50"
                )}
                activeOpacity={0.7}
              >
                <View className={clsx("h-10 w-10 rounded-xl items-center justify-center mr-4", item.color)}>
                  {/* @ts-ignore */}
                  <item.icon size={20} color={item.iconColor} />
                </View>
                <Text className="flex-1 text-base font-semibold text-slate-700">
                  {item.title}
                </Text>
                {/* @ts-ignore */}
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity Placeholder */}
        <View className="px-6 mt-8">
          <Text className="text-sm font-bold text-slate-900 mb-4">
            Aktiviteti i fundit
          </Text>
          <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
             <View className="flex-row items-center mb-3">
                {/* @ts-ignore */}
                <TrendingUp size={16} color="#10B981" className="mr-2" />
                <Text className="text-xs text-gray-500">
                   <Text className="font-bold text-slate-700">User #1234</Text> bleu pakon Premium
                </Text>
             </View>
             <View className="flex-row items-center">
                {/* @ts-ignore */}
                <TrendingUp size={16} color="#3B82F6" className="mr-2" />
                <Text className="text-xs text-gray-500">
                   <Text className="font-bold text-slate-700">User #5678</Text> përfundoi testin me 100%
                </Text>
             </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
