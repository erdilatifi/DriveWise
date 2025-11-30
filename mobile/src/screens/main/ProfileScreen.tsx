import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Image, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlans } from '@drivewise/core';
import { Button } from '@/components/ui/Button';
import { User, Bell, Moon, Smartphone, Key, RefreshCcw, LogOut, ChevronRight, MessageCircle, Instagram, Facebook, AlertCircle, CreditCard, Volume2, Sun, Monitor, Clock, Bug, Trash2 } from 'lucide-react-native';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { ReportBugModal } from '@/components/modals/ReportBugModal';
import { DeleteAccountModal } from '@/components/modals/DeleteAccountModal';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';

export const ProfileScreen = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { data: plans, isLoading: plansLoading } = useUserPlans(user?.id);
  const navigation = useNavigation<any>();
  const [isDark, setIsDark] = React.useState(false); // Mock state for now
  const [showBugModal, setShowBugModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  if (authLoading || (user && plansLoading)) {
    return <ProfileSkeleton />;
  }

  const activePlan = plans?.find(p => p.status === 'active');

  // Calculate subscription progress
  const getSubscriptionDetails = () => {
    if (!activePlan) return { progress: 0, daysLeft: 0, durationMonths: 0 };
    
    const start = new Date(activePlan.start_date).getTime();
    const end = new Date(activePlan.end_date).getTime();
    const now = new Date().getTime();
    
    const totalDurationMs = end - start;
    const elapsedMs = now - start;
    
    // Progress 0-100
    const progress = Math.min(Math.max((elapsedMs / totalDurationMs) * 100, 0), 100);
    
    // Days remaining
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    
    // Duration in months (approx)
    const durationMonths = Math.round(totalDurationMs / (1000 * 60 * 60 * 24 * 30));

    return { progress, daysLeft, durationMonths };
  };

  const { progress, daysLeft, durationMonths } = getSubscriptionDetails();

  const toolsItems = [
    ...(user ? [{
      icon: User,
      title: 'Të dhënat personale',
      // @ts-ignore
      rightElement: <ChevronRight size={20} color="#94a3b8" />,
      color: 'text-white',
      bgColor: 'bg-[#1e1b4b]',
      onPress: () => navigation.navigate('PersonalInfo'),
    }] : []),
    ...(user ? [{
      icon: Clock,
      title: 'Historiku i Testeve',
      // @ts-ignore
      rightElement: <ChevronRight size={20} color="#94a3b8" />,
      color: 'text-white',
      bgColor: 'bg-[#3b82f6]',
      onPress: () => navigation.navigate('TestHistory'),
    }] : []),
    {
      icon: Sun,
      title: 'Pamja',
      rightElement: <Text className="text-gray-400">{isDark ? 'Dark' : 'Light'}</Text>,
      color: 'text-white',
      bgColor: 'bg-green-500',
      onPress: () => {
        // Navigate to appearance settings or toggle
        Alert.alert('Pamja', 'Këtu mund të zgjidhni pamjen (Light/Dark/System).', [
          { text: 'Light', onPress: () => setIsDark(false) },
          { text: 'Dark', onPress: () => setIsDark(true) },
          { text: 'System', onPress: () => {} },
        ]);
      },
    },
    {
      icon: MessageCircle,
      title: 'Mbështetja teknike',
      // @ts-ignore
      rightElement: <ChevronRight size={20} color="#94a3b8" />,
      color: 'text-white',
      bgColor: 'bg-green-500',
      onPress: () => {},
    },
    {
      icon: Bug,
      title: 'Raporto problem',
      // @ts-ignore
      rightElement: <ChevronRight size={20} color="#94a3b8" />,
      color: 'text-white',
      bgColor: 'bg-slate-600',
      onPress: () => setShowBugModal(true),
    },
    {
      icon: Trash2,
      title: 'Fshij llogarinë',
      // @ts-ignore
      rightElement: <ChevronRight size={20} color="#94a3b8" />,
      color: 'text-white',
      bgColor: 'bg-red-500',
      onPress: () => setShowDeleteModal(true),
    },
  ];

  const socialItems = [
    {
      icon: Instagram,
      title: 'Instagram',
      color: 'text-white',
      bgColor: 'bg-pink-500',
      onPress: () => {},
    },
    {
      icon: Facebook,
      title: 'Facebook',
      color: 'text-white',
      bgColor: 'bg-blue-600',
      onPress: () => {},
    },
    {
      icon: Monitor, // TikTok
      title: 'TikTok',
      color: 'text-white',
      bgColor: 'bg-black',
      onPress: () => {},
    },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-4 pb-8">
            <View className="flex-row justify-between items-center mb-6">
               <Text className="text-4xl font-extrabold text-slate-900">Profili</Text>
               <View className="h-20 w-20 rounded-full bg-white overflow-hidden items-center justify-center border-2 border-slate-200 shadow-sm">
                  {/* Profile Image Placeholder */}
                  {/* @ts-ignore */}
                  <User size={40} color="#334155" />
               </View>
            </View>

            {user ? (
              <View className="mb-8 rounded-3xl p-6 shadow-lg overflow-hidden border border-slate-200 bg-white">
                <View className="flex-row justify-between items-center mb-4">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      {activePlan ? `Paketa ${activePlan.category}` : 'Llogaria Falas'}
                    </Text>
                    <Text className="text-slate-500 text-sm">
                      {activePlan 
                        ? `Skadon më: ${new Date(activePlan.end_date).toLocaleDateString('sq-AL')}` 
                        : 'Upgrade për më shumë veçori'}
                    </Text>
                  </View>
                  {!activePlan ? (
                    <View className="bg-[#1e1b4b] px-3 py-1 rounded-full">
                       <Text className="text-white text-xs font-bold uppercase">Free</Text>
                    </View>
                  ) : (
                    <View className="bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                       <Text className="text-amber-700 text-xs font-bold uppercase">{durationMonths} Muaj</Text>
                    </View>
                  )}
                </View>

                {activePlan && (
                  <>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-xs text-slate-400 font-bold">Progresi i kohës</Text>
                      <Text className="text-xs text-[#1e1b4b] font-bold">{daysLeft} ditë të mbetura</Text>
                    </View>
                    <View className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <View 
                        className="h-full bg-[#1e1b4b] rounded-full" 
                        style={{ width: `${progress}%` }} 
                      />
                    </View>
                  </>
                )}
                
                {!activePlan && (
                  <Button 
                    label="Bëhu Premium" 
                    onPress={() => navigation.navigate('Subscription')}
                    className="mt-2 bg-[#1e1b4b]"
                    textClassName="text-white font-bold italic tracking-widest"
                  />
                )}
              </View>
            ) : (
              <View className="mb-8 rounded-3xl p-6 shadow-lg items-center overflow-hidden border border-slate-200 bg-white">
                 <Text className="text-lg font-bold text-slate-900 mb-2">Mirësevini në DriveWise</Text>
                 <Text className="text-slate-500 text-sm text-center mb-4">
                   Hyni në llogarinë tuaj për të ruajtur progresin dhe për të parë statistikat.
                 </Text>
                 <Button 
                   label="Hyni në llogari" 
                   onPress={() => navigation.navigate('Login')}
                   className="w-full bg-[#1e1b4b]"
                   textClassName="text-white font-bold"
                 />
              </View>
            )}

            {/* Veglat */}
            <View className="mb-6">
               <Text className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">VEGLAT</Text>
               <View className="bg-white rounded-3xl overflow-hidden border border-slate-200">
                  {toolsItems.map((item, index) => (
                     <TouchableOpacity
                        key={index}
                        onPress={item.onPress}
                        className={clsx(
                           "flex-row items-center p-4",
                           index !== toolsItems.length - 1 && "border-b border-slate-100"
                        )}
                     >
                        <View className={clsx("h-8 w-8 rounded-lg items-center justify-center mr-4", item.bgColor)}>
                           {/* @ts-ignore */}
                           <item.icon size={18} color="white" />
                        </View>
                        <Text className="flex-1 font-bold text-slate-700 text-base">{item.title}</Text>
                        {item.rightElement}
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {/* Rrjetet Sociale */}
            <View className="mb-8">
               <Text className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">RRJETET TONA SOCIALE:</Text>
               <View className="bg-white rounded-3xl overflow-hidden border border-slate-200">
                  {socialItems.map((item, index) => (
                     <TouchableOpacity
                        key={index}
                        onPress={item.onPress}
                        className={clsx(
                           "flex-row items-center p-4",
                           index !== socialItems.length - 1 && "border-b border-slate-100"
                        )}
                     >
                        <View className={clsx("h-8 w-8 rounded-lg items-center justify-center mr-4", item.bgColor)}>
                           {/* @ts-ignore */}
                           <item.icon size={18} color="white" />
                        </View>
                        <Text className="flex-1 font-bold text-slate-700 text-base">{item.title}</Text>
                        {/* @ts-ignore */}
                        <ChevronRight size={20} color="#94a3b8" />
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {user && (
              <Button 
                label="Dil" 
                variant="ghost" 
                onPress={signOut} 
                className="border border-slate-200 bg-white"
                textClassName="text-red-500"
                // @ts-ignore
                icon={<LogOut size={20} className="text-red-500 mr-2" color="#EF4444" />}
              />
            )}
          </View>
        </ScrollView>
        <ReportBugModal visible={showBugModal} onClose={() => setShowBugModal(false)} />
        <DeleteAccountModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
      </SafeAreaView>
    </View>
  );
};

