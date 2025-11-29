import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LiteratureStackParamList } from '../../navigation/LiteratureNavigator';
import { ALL_SIGNS, TrafficSign } from '../../data/signs';
import { X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

type NavigationProp = NativeStackNavigationProp<LiteratureStackParamList>;
type ScreenRouteProp = RouteProp<LiteratureStackParamList, 'SignsList'>;

const { width } = Dimensions.get('window');
const COLUMNS = 3;
const GAP = 12;
const ITEM_WIDTH = (width - 48 - (GAP * (COLUMNS - 1))) / COLUMNS;

export const SignsListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { categoryId, title } = route.params;

  const signs = ALL_SIGNS.filter(s => s.categoryId === categoryId);
  const [selectedSign, setSelectedSign] = useState<TrafficSign | null>(null);

  const renderItem = ({ item, index }: { item: TrafficSign; index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 50).springify()}
      style={{ width: ITEM_WIDTH, marginBottom: GAP }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedSign(item)}
        style={styles.itemCard}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={item.image} 
            style={styles.signImage} 
            resizeMode="contain" 
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>{signs.length} shenja</Text>
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
            <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              activeOpacity={1} 
              onPress={() => setSelectedSign(null)}
            />
            
            <Animated.View 
              entering={FadeIn.duration(200)}
              style={styles.modalContent}
            >
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedSign(null)}
              >
                <X color="#1e293b" size={24} />
              </TouchableOpacity>

              <View style={styles.modalImageContainer}>
                <Image 
                  source={selectedSign.image} 
                  style={styles.modalImage} 
                  resizeMode="contain" 
                />
              </View>

              <View style={styles.modalTextContainer}>
                <Text style={styles.modalTitle}>{selectedSign.name}</Text>
                <Text style={styles.modalDescription}>{selectedSign.description}</Text>
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
    backgroundColor: '#f8fafc',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButtonText: {
    fontSize: 24,
    color: '#1e293b',
    marginTop: -4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  listContent: {
    padding: 24,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  modalImageContainer: {
    width: 120,
    height: 120,
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
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
});
