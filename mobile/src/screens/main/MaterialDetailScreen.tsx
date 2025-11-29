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
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#ce76c9" />
      </SafeAreaView>
    );
  }

  // specific renderer for the "Chapter" JSON structure found in the web app
  const renderChapterContent = (content: any) => {
    const chapter = content?.chapter;
    if (!chapter) return null;

    return (
      <View className="space-y-6">
        {/* Chapter Title & Description */}
        <View className="mb-6">
           {chapter.title && (
             <Text className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
               {chapter.title}
             </Text>
           )}
           {chapter.description && (
             <Text className="text-base text-slate-600 leading-7">
               {chapter.description}
             </Text>
           )}
        </View>

        {/* Sections */}
        {chapter.sections?.map((section: any, index: number) => {
           const points = Array.isArray(section.points) 
             ? section.points 
             : typeof section.points === 'string' 
               ? [section.points] 
               : [];

           return (
             <View key={index} className="mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
               {/* Section Title */}
               {section.title && (
                 <View className="flex-row items-center mb-3">
                   <View className="h-2 w-2 rounded-full bg-orange-500 mr-2" />
                   <Text className="text-lg font-bold text-slate-800 flex-1">
                     {section.title}
                   </Text>
                 </View>
               )}

               {/* Points List */}
               <View className="space-y-3">
                 {points.map((point: any, pIndex: number) => (
                   <View key={pIndex} className="flex-row items-start pl-1">
                     <View className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-2 mr-3" />
                     <Text className="text-base text-slate-600 flex-1 leading-7">
                       {point}
                     </Text>
                   </View>
                 ))}
               </View>
             </View>
           );
        })}
      </View>
    );
  };

  // Recursive Rich Text Renderer (Fallback for ProseMirror/TipTap)
  const renderRichText = (node: any, index: number = 0): React.ReactNode => {
    // ... (existing ProseMirror logic kept as fallback)
    if (!node) return null;
    if (typeof node === 'string') return <Text key={index} className="text-base text-slate-700 leading-7 mb-4">{node}</Text>;
    if (Array.isArray(node)) return node.map((child, i) => renderRichText(child, i));
    
    // ... (rest of existing renderRichText logic)
    if (node.type === 'text') { /* ... */ return <Text key={index} className="text-slate-700">{node.text}</Text>; }
    if (node.type === 'doc' && node.content) return node.content.map((c:any, i:number) => renderRichText(c, i));
    if (node.type === 'paragraph') return <Text key={index} className="mb-4 text-base text-slate-700 leading-7">{node.content?.map((c:any, i:number) => renderRichText(c, i))}</Text>;
    
    return null; 
  };

  const renderContent = (content: any) => {
      if (!content) return null;
      
      // Priority 1: Check for "Chapter" structure
      if (content.chapter) {
          return renderChapterContent(content);
      }

      // Priority 2: Check for ProseMirror "doc" structure
      if (content.type === 'doc' || Array.isArray(content)) {
          return renderRichText(content);
      }

      // Priority 3: Plain string or unknown object
      if (typeof content === 'string') {
          return <Text className="text-base text-slate-700 leading-7">{content}</Text>;
      }

      return <Text className="text-red-500">Format i panjohur</Text>;
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* ... Header ... */}
      <View className="px-6 py-4 bg-white border-b border-slate-100 flex-row items-center shadow-sm z-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2 -ml-2 rounded-full active:bg-slate-100">
           {/* @ts-ignore */}
           <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900 flex-1" numberOfLines={1}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false} className="bg-white">
        {/* Hero Images */}
        {material?.images && material.images.length > 0 && (
          <View className="mb-8">
             {material.images.map((img) => (
               <View key={img.id} className="mb-6 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                 <Image source={{ uri: img.image_url }} style={{ width: '100%', height: 220, resizeMode: 'cover' }} />
                 {img.caption_sq && (
                   <View className="bg-white/95 p-3 border-t border-slate-100">
                     <Text className="text-xs text-slate-500 font-medium text-center">{img.caption_sq}</Text>
                   </View>
                 )}
               </View>
             ))}
          </View>
        )}

        {/* Content */}
        <View className="mb-8">
           {renderContent(material?.content_sq)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
