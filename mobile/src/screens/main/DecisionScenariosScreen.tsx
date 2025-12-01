import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { X, ChevronRight, Target, BrainCircuit, Car, AlertTriangle, Ban, Activity } from 'lucide-react-native';
import { useTheme } from '../../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DecisionScenarios'>;
type RouteProps = RouteProp<RootStackParamList, 'DecisionScenarios'>;

const TOPICS = [
  {
    id: 'traffic_lights',
    title: 'Semaforët',
    description: 'Kuptimi i dritave të semaforit dhe sinjaleve të trafikut.',
    icon: Activity,
    color: '#ef4444',
    image: 'https://images.unsplash.com/photo-1566244654055-6b3554f6e339?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'road_signs',
    title: 'Shenjat e Trafikut',
    description: 'Mësoni format, ngjyrat dhe kuptimet e shenjave.',
    icon: Ban,
    color: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1564691899618-13a8c0124d10?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pedestrian_safety',
    title: 'Siguria e Këmbësorëve',
    description: 'Rregullat për mbrojtjen e këmbësorëve në rrugë.',
    icon: Target, // Fallback icon
    color: '#10b981',
    image: 'https://images.unsplash.com/photo-1557332346-203d04e58908?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'right_of_way',
    title: 'Përparësia e Kalimit',
    description: 'Kush kalon i pari në kryqëzime dhe situata të ndryshme.',
    icon: Car,
    color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1604357209793-fca5dca89f97?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'road_hazard',
    title: 'Rreziqet në Rrugë',
    description: 'Identifikimi dhe reagimi ndaj rreziqeve të papritura.',
    icon: AlertTriangle,
    color: '#ea580c',
    image: 'https://images.unsplash.com/photo-1619685767540-0c6710f96347?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'parking_rules',
    title: 'Rregullat e Parkimit',
    description: 'Ku dhe si lejohet të parkoni mjetin tuaj.',
    icon: BrainCircuit,
    color: '#6366f1',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80'
  }
];

export const DecisionScenariosScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { category } = route.params;
  const { isDark } = useTheme();

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800"
          >
            {/* @ts-ignore */}
            <X size={24} color={isDark ? "#94a3b8" : "#1e293b"} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-slate-900 dark:text-white">Zgjidh Temën</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 p-4">
          <Text className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Zgjidhni një temë për të filluar trajnimin.
          </Text>

          <View className="gap-4 pb-8">
            {TOPICS.map((topic, index) => (
              <TouchableOpacity
                key={topic.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none active:scale-95 transform transition-all"
                onPress={() => navigation.navigate('DecisionGame', { category, topic: topic.id })}
              >
                <View className="flex-row h-28">
                  {/* Image Section */}
                  <View className="w-28 h-full bg-slate-100 dark:bg-slate-800">
                    <Image
                        source={{ uri: topic.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/20" />
                  </View>

                  {/* Content Section */}
                  <View className="flex-1 p-3 justify-between">
                    <View>
                      <Text className="text-base font-bold text-slate-900 dark:text-white mb-1">
                        {topic.title}
                      </Text>
                      <Text className="text-xs text-slate-500 dark:text-slate-400 leading-4" numberOfLines={2}>
                        {topic.description}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                            <Text className="text-[10px] font-bold text-slate-600 dark:text-slate-400">30 Pyetje</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-xs font-bold text-blue-600 mr-1">Fillo</Text>
                            {/* @ts-ignore */}
                            <ChevronRight size={14} color="#2563eb" />
                        </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};


