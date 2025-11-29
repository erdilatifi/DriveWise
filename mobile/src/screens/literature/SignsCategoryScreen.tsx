import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LiteratureStackParamList } from '../../navigation/LiteratureNavigator';
import { AlertTriangle, Octagon, Info, ArrowUpCircle, Ban, ChevronRight, BookOpen } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

type NavigationProp = NativeStackNavigationProp<LiteratureStackParamList>;

const SIGN_CATEGORIES = [
  {
    id: 'danger',
    title: 'Shenjat e Rrezikut',
    subtitle: 'Paralajmërojnë për rreziqe në rrugë',
    icon: AlertTriangle,
    gradient: ['#fee2e2', '#fecaca'] as const, // Soft Red
    iconColor: '#dc2626',
    borderColor: '#fca5a5',
    count: 54,
    available: true,
    description: 'Trekëndësh me bordurë të kuqe. Vendosen 150-250m para rrezikut.'
  },
  {
    id: 'prohibition',
    title: 'Shenjat e Ndalimit',
    subtitle: 'Ndalojnë ose kufizojnë lëvizjen',
    icon: Ban,
    gradient: ['#ffedd5', '#fed7aa'] as const, // Soft Orange
    iconColor: '#ea580c',
    borderColor: '#fdba74',
    count: 45,
    available: true,
    description: 'Rrethore me bordurë të kuqe. Hyjnë në fuqi menjëherë.'
  },
  {
    id: 'mandatory',
    title: 'Shenjat e Urdhërit',
    subtitle: 'Veprime të detyrueshme',
    icon: ArrowUpCircle,
    gradient: ['#dbeafe', '#bfdbfe'] as const, // Soft Blue
    iconColor: '#2563eb',
    borderColor: '#93c5fd',
    count: 17,
    available: true,
    description: 'Rrethore blu me simbole të bardha. Detyrim për t\'u respektuar.'
  },
  {
    id: 'info',
    title: 'Shenjat Lajmëruese',
    subtitle: 'Informacione dhe orientim',
    icon: Info,
    gradient: ['#dcfce7', '#bbf7d0'] as const, // Soft Green
    iconColor: '#16a34a',
    borderColor: '#86efac',
    count: 66,
    available: true,
    description: 'Katërkëndëshe. Ofrojnë informata për rrugën dhe shërbimet.'
  },
];

const { width } = Dimensions.get('window');

export const SignsCategoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Sinjalizimi Rrugor</Text>
            <Text style={styles.headerSubtitle}>Zgjidhni kategorinë për të mësuar</Text>
          </View>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <Animated.View 
            entering={FadeInDown.delay(100).springify()}
            style={styles.heroCard}
          >
            <LinearGradient
              colors={['#1e293b', '#0f172a']}
              style={styles.heroGradient}
            >
              <View style={styles.heroContent}>
                <View style={styles.heroIconContainer}>
                  <BookOpen color="#60a5fa" size={32} />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.heroTitle}>Katalogu i plotë</Text>
                  <Text style={styles.heroText}>
                    Mbi 180 shenja të shpjeguara me detaje dhe rregullat përkatëse.
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.sectionTitle}>Kategoritë</Text>

          <View style={styles.cardsContainer}>
            {SIGN_CATEGORIES.map((category, index) => (
              <Animated.View 
                key={category.id}
                entering={FadeInDown.delay(200 + (index * 100)).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('SignsList', { 
                    categoryId: category.id,
                    title: category.title 
                  })}
                  style={[styles.card, { borderColor: category.borderColor }]}
                >
                  <LinearGradient
                    colors={category.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                        <category.icon color={category.iconColor} size={28} strokeWidth={2.5} />
                      </View>
                      <View style={styles.countBadge}>
                        <Text style={[styles.countText, { color: category.iconColor }]}>{category.count}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle}>{category.title}</Text>
                      <Text style={styles.cardSubtitle}>{category.subtitle}</Text>
                      <View style={styles.divider} />
                      <Text style={styles.cardDesc} numberOfLines={2}>
                        {category.description}
                      </Text>
                    </View>

                    <View style={styles.cardFooter}>
                      <Text style={[styles.learnMore, { color: category.iconColor }]}>Mëso më shumë</Text>
                      <ChevronRight size={16} color={category.iconColor} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonArrow: {
    fontSize: 20,
    color: '#334155',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  heroGradient: {
    padding: 24,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  heroText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardBody: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a', // slate-900
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569', // slate-600
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 12,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  learnMore: {
    fontSize: 13,
    fontWeight: '700',
  },
});

