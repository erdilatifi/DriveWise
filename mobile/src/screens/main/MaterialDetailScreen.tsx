import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useMaterial } from '@drivewise/core';
import { RootStackParamList } from '../../navigation/types';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

type MaterialDetailRouteProp = RouteProp<RootStackParamList, 'MaterialDetail'>;

export const MaterialDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<MaterialDetailRouteProp>();
  const { materialId, title } = route.params;
  const { data: material, isLoading } = useMaterial(materialId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
        <ActivityIndicator size="large" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  // Generic JSON Renderer (mirrors web implementation)
  const renderContentValue = (value: any, depth: number = 0): React.ReactNode => {
    if (!value) return null;

    // 1. String -> Paragraph
    if (typeof value === 'string') {
      return (
        <Text key={Math.random()} className="text-base text-slate-700 dark:text-slate-300 leading-7 mb-4">
          {value}
        </Text>
      );
    }

    // 2. Array -> List
    if (Array.isArray(value)) {
      return (
        <View key={Math.random()} className="mb-4 space-y-2 pl-2">
          {value.map((item, idx) => (
            <View key={idx} className="flex-row items-start">
              <View className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2.5 mr-3" />
              <View className="flex-1">
                {renderContentValue(item, depth + 1)}
              </View>
            </View>
          ))}
        </View>
      );
    }

    // 3. Object -> Sections (Chapter structure or generic keys)
    if (typeof value === 'object') {
      // Handle specific "Chapter" structure if present at root
      if (depth === 0 && value.chapter) {
        return renderContentValue(value.chapter, depth + 1);
      }

      // Specific Chapter fields
      if (value.title || value.description || value.sections) {
         return (
           <View key={Math.random()} className="mb-6">
             {value.title && (
               <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                 {value.title}
               </Text>
             )}
             {value.description && (
               <Text className="text-base text-slate-600 dark:text-slate-400 leading-7 mb-6">
                 {value.description}
               </Text>
             )}
             {value.sections && renderContentValue(value.sections, depth + 1)}
           </View>
         );
      }

      // Generic Object iteration (fallback for other structures)
      return (
        <View key={Math.random()} className="space-y-4">
          {Object.entries(value).map(([key, subValue]) => {
            // Skip internal keys or IDs if needed, but usually show content
            if (key === 'id' || key === 'order') return null;
            
            return (
              <View key={key} className="mb-4">
                {/* Check if key is a meaningful title (not numeric index) */}
                {isNaN(Number(key)) && (
                  <View className="flex-row items-center mb-2">
                    <View className="h-1 w-1 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-2" />
                    <Text className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                      {key.replace(/_/g, ' ')}
                    </Text>
                  </View>
                )}
                {renderContentValue(subValue, depth + 1)}
              </View>
            );
          })}
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA] dark:bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex-row items-center shadow-sm dark:shadow-none z-10 rounded-b-[32px]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2 -ml-2 rounded-full active:bg-slate-50 dark:active:bg-slate-800">
           {/* @ts-ignore */}
           <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900 dark:text-white flex-1" numberOfLines={1}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Hero Images */}
        {material?.images && material.images.length > 0 && (
          <View className="mb-8">
             {material.images.map((img) => (
               <View key={img.id} className="mb-6 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
                 <Image source={{ uri: img.image_url }} style={{ width: '100%', height: 220, resizeMode: 'cover' }} />
                 {img.caption && (
                   <View className="bg-white dark:bg-slate-900 p-4 border-t border-slate-100 dark:border-slate-800">
                     <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium text-center">{img.caption}</Text>
                   </View>
                 )}
               </View>
             ))}
          </View>
        )}

        {/* Content */}
        <View className="mb-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
           {material?.content ? (
             renderContentValue(material.content)
           ) : (
             <Text className="text-slate-400 dark:text-slate-500 italic text-center py-10">
               Përmbajtja nuk është e disponueshme.
             </Text>
           )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


