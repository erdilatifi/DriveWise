import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LiteratureStackParamList } from '../../navigation/LiteratureNavigator';
import { X, ChevronLeft, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { RoadSign } from '@drivewise/core';
import { useTheme } from '../../theme';

type NavigationProp = NativeStackNavigationProp<LiteratureStackParamList>;
type ScreenRouteProp = RouteProp<LiteratureStackParamList, 'SignsList'>;

// DESIGN TOKENS
const BG_COLOR = "#F7F8FA";

const { width } = Dimensions.get('window');
const COLUMNS = 3;
const GAP = 12;
const ITEM_WIDTH = (width - 48 - (GAP * (COLUMNS - 1))) / COLUMNS;

export const SignsListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { categoryId, title } = route.params; // categoryId: 'danger', 'prohibition', etc.
  const { isDark } = useTheme();

  const [selectedSign, setSelectedSign] = useState<RoadSign | null>(null);

  // Fetch signs from DB
  const { data: signs = [], isLoading, error } = useQuery({
    queryKey: ['traffic_signs', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('traffic_signs')
        .select('*')
        .eq('category', categoryId);
      
      if (error) throw error;
      
      // Transform image_url to public URL
      return data.map((sign: RoadSign) => ({
        ...sign,
        image_url: sign.image_url 
          ? supabase.storage.from('signs').getPublicUrl(sign.image_url).data.publicUrl
          : null
      })) as RoadSign[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const renderItem = ({ item, index }: { item: RoadSign; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).springify()}
      style={{ width: ITEM_WIDTH, marginBottom: GAP }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedSign(item)}
        className="bg-white dark:bg-slate-800 rounded-3xl p-2 aspect-square items-center justify-center shadow-sm shadow-slate-200 dark:shadow-none border border-transparent dark:border-slate-700"
      >
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image 
              source={{ uri: item.image_url }} 
              style={styles.signImage} 
              resizeMode="contain" 
            />
          ) : (
            <View className="items-center justify-center">
               <Text className="text-xs text-slate-400 text-center">{item.code}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-white dark:bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white dark:bg-slate-950 items-center justify-center p-6">
        <AlertCircle size={40} color="#ef4444" />
        <Text className="text-slate-500 mt-4 text-center">Gabim gjatë ngarkimit të shenjave.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 bg-slate-100 p-3 rounded-full">
           <Text className="text-slate-700 font-semibold">Kthehu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px] mb-4 overflow-hidden">
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={[styles.backButton, isDark && styles.backButtonDark]}
            >
              <ChevronLeft size={24} color={isDark ? '#94a3b8' : '#334155'} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle} className="text-slate-900 dark:text-white">{title}</Text>
              <Text style={styles.headerSubtitle} className="text-slate-500 dark:text-slate-400">{signs.length} shenja</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={signs}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={COLUMNS}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
               <Text className="text-slate-400">Nuk u gjetën shenja për këtë kategori.</Text>
            </View>
          }
        />
      </SafeAreaView>

      {/* Detail Modal */}
      <Modal
        visible={!!selectedSign}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedSign(null)}
      >
        {selectedSign && (
          <View style={styles.modalOverlay}>
            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              activeOpacity={1} 
              onPress={() => setSelectedSign(null)}
            />
            
            <Animated.View 
              entering={FadeIn.duration(200)}
              className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[32px] p-8 items-center shadow-xl shadow-black/20"
            >
              <TouchableOpacity 
                style={[styles.closeButton, isDark && styles.closeButtonDark]}
                onPress={() => setSelectedSign(null)}
              >
                <X color={isDark ? '#94a3b8' : '#64748b'} size={24} />
              </TouchableOpacity>

              <View style={styles.modalImageContainer}>
                {selectedSign.image_url && (
                  <Image 
                    source={{ uri: selectedSign.image_url }} 
                    style={styles.modalImage} 
                    resizeMode="contain" 
                  />
                )}
              </View>

              <View style={styles.modalTextContainer}>
                <Text style={styles.modalTitle} className="text-slate-900 dark:text-white">{selectedSign.name}</Text>
                <Text style={styles.modalDescription} className="text-slate-500 dark:text-slate-400">{selectedSign.description}</Text>
              </View>
            </Animated.View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButtonDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  listContent: {
    padding: 24,
    paddingBottom: 120,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent', // Clean look
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signImage: {
    width: '90%',
    height: '90%',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 340,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
  },
  closeButtonDark: {
    backgroundColor: '#334155',
  },
  modalImageContainer: {
    width: 140,
    height: 140,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalTextContainer: {
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
});


