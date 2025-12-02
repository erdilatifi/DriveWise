import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { useTestHistory, useDeleteTestAttempt } from '@drivewise/core';
import { ChevronLeft, Calendar, CheckCircle2, XCircle, Trash2 } from 'lucide-react-native';
import { clsx } from 'clsx';
import { Button } from '../../components/ui/Button';
import { LoadingScreen } from '../../components/ui/LoadingScreen';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TestHistoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [limit, setLimit] = useState(20);
  const { data, isLoading, isFetching } = useTestHistory(user?.id, 1, limit);
  const deleteMutation = useDeleteTestAttempt();

  if (isLoading && limit === 20) {
    return <LoadingScreen />;
  }

  const history = ((data?.tests || []) as any[]).filter((t: any) => !t.test_number?.toString().startsWith('personalized'));
  const totalCount = data?.totalCount || 0;

  const handleDelete = (id: string) => {
    Alert.alert(
      "Fshij Testin",
      "Jeni i sigurt që dëshironi ta fshini këtë test nga historiku?",
      [
        { text: "Anulo", style: "cancel" },
        { 
          text: "Fshij", 
          style: "destructive", 
          onPress: () => deleteMutation.mutate(id) 
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top']}>
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#35565f" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#35565f] dark:text-white">Historiku i Testeve</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 200 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Text className="text-gray-400 dark:text-slate-500 text-center">Nuk keni bërë asnjë test akoma.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isPassed = item.percentage >= 85;
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('TestResult', { attemptId: item.id })}
              className="mb-4 flex-row items-center rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm dark:shadow-none"
            >
              <View className={clsx(
                "h-12 w-12 items-center justify-center rounded-full mr-4",
                isPassed ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
              )}>
                {isPassed ? (
                  // @ts-ignore
                  <CheckCircle2 size={20} color="#22C55E" />
                ) : (
                  // @ts-ignore
                  <XCircle size={20} color="#EF4444" />
                )}
              </View>
              
              <View className="flex-1">
                <Text className="text-base font-bold text-[#35565f] dark:text-white">
                  Testi {item.test_number}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Calendar size={12} color="#9CA3AF" className="mr-1" />
                  <Text className="text-xs text-gray-400 dark:text-slate-500">
                    {new Date(item.completed_at).toLocaleDateString('sq-AL')}
                  </Text>
                </View>
              </View>

              <View className="items-end mr-3">
                <Text className={clsx(
                  "text-lg font-extrabold",
                  isPassed ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                )}>
                  {item.percentage}%
                </Text>
                <Text className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                  {item.score}/{item.total_questions}
                </Text>
              </View>

              <TouchableOpacity 
                onPress={() => handleDelete(item.id)}
                className="p-2"
              >
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          totalCount > limit ? (
            <View className="mt-4 mb-8">
              <Button 
                label={isFetching ? "Duke ngarkuar..." : "Shiko më shumë"}
                onPress={() => setLimit(l => l + 20)}
                variant="outline"
                className="w-full"
                disabled={isFetching}
              />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};


