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

  // Render a section with title and points (matching web structure)
  const renderSection = (section: any, index: number): React.ReactNode => {
    const pointsRaw = section.points;
    const pointsArray = Array.isArray(pointsRaw)
      ? pointsRaw
      : typeof pointsRaw === 'string'
        ? [pointsRaw]
        : [];

    return (
      <View key={section.order ?? index} className="mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
        {section.title && (
          <View className="flex-row items-center mb-4">
            <View className="h-2 w-2 rounded-full bg-indigo-500 mr-3" />
            <Text className="text-lg font-bold text-slate-900 dark:text-white flex-1">
              {section.title}
            </Text>
          </View>
        )}
        {pointsArray.length > 0 && (
          <View className="gap-3">
            {pointsArray.map((point: any, idx: number) => (
              <View key={idx} className="flex-row items-start pl-4 border-l-2 border-slate-200 dark:border-slate-600">
                <Text className="text-sm text-slate-600 dark:text-slate-300 leading-6 flex-1">
                  {typeof point === 'string' ? point : String(point)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

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

    // 2. Array -> Check if it's an array of sections or generic items
    if (Array.isArray(value)) {
      // Check if this looks like a sections array (objects with title/points)
      const looksLikeSections = value.length > 0 && 
        typeof value[0] === 'object' && 
        value[0] !== null &&
        ('title' in value[0] || 'points' in value[0]);

      if (looksLikeSections) {
        return (
          <View key={Math.random()} className="gap-4">
            {value.map((section, idx) => renderSection(section, idx))}
          </View>
        );
      }

      // Generic array -> List
      return (
        <View key={Math.random()} className="mb-4 gap-2 pl-2">
          {value.map((item, idx) => (
            <View key={idx} className="flex-row items-start">
              <View className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-2.5 mr-3" />
              <View className="flex-1">
                {typeof item === 'string' ? (
                  <Text className="text-base text-slate-700 dark:text-slate-300 leading-6">
                    {item}
                  </Text>
                ) : (
                  renderContentValue(item, depth + 1)
                )}
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

      // Specific Chapter fields with sections array
      if (value.title || value.description || value.sections) {
         const sections = Array.isArray(value.sections) ? value.sections : [];
         
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
             {sections.length > 0 && (
               <View className="gap-4">
                 {sections.map((section: any, idx: number) => renderSection(section, idx))}
               </View>
             )}
           </View>
         );
      }

      // Generic Object iteration (fallback for other structures)
      return (
        <View key={Math.random()} className="gap-4">
          {Object.entries(value).map(([key, subValue]) => {
            // Skip internal keys or IDs if needed
            if (key === 'id' || key === 'order') return null;
            
            return (
              <View key={key} className="mb-4">
                {/* Check if key is a meaningful title (not numeric index) */}
                {isNaN(Number(key)) && (
                  <View className="flex-row items-center mb-2">
                    <View className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-2" />
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

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 200 }} showsVerticalScrollIndicator={false}>
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
           {(() => {
             // Parse content if it's a string (Supabase might return JSONB as string)
             let content: any = material?.content;
             if (typeof content === 'string') {
               try {
                 content = JSON.parse(content);
               } catch (e) {
                 // If parsing fails, show the string as-is
                 return (
                   <Text className="text-base text-slate-700 dark:text-slate-300 leading-7">
                     {content as string}
                   </Text>
                 );
               }
             }
             
             if (content && typeof content === 'object' && Object.keys(content).length > 0) {
               return renderContentValue(content);
             }
             
             return (
               <View className="py-10">
                 <Text className="text-slate-400 dark:text-slate-500 italic text-center mb-4">
                   Përmbajtja nuk është e disponueshme.
                 </Text>
                 {__DEV__ && (
                   <Text className="text-xs text-slate-400 dark:text-slate-600 text-center">
                     Debug: content type = {typeof material?.content}, value = {JSON.stringify(material?.content)?.slice(0, 100)}
                   </Text>
                 )}
               </View>
             );
           })()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


