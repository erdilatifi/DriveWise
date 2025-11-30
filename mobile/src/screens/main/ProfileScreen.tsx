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

// DESIGN TOKENS
const PRIMARY = "#4f46e5";
const BG_COLOR = "#F7F8FA";

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
      rightElement: <ChevronRight size={18} color="#94a3b8" />,
      color: 'text-slate-900',
      bgColor: 'bg-slate-50',
      onPress: () => navigation.navigate('PersonalInfo'),
    }] : []),
    ...(user ? [{
      icon: Clock,
      title: 'Historiku i Testeve',
      rightElement: <ChevronRight size={18} color="#94a3b8" />,
      color: 'text-slate-900',
      bgColor: 'bg-slate-50',
      onPress: () => navigation.navigate('TestHistory'),
    }] : []),
    {
      icon: Sun,
      title: 'Pamja',
      rightElement: <Text className="text-slate-400 text-xs font-medium">{isDark ? 'Dark' : 'Light'}</Text>,
      color: 'text-slate-900',
      bgColor: 'bg-slate-50',
      onPress: () => {
        Alert.alert('Pamja', 'Këtu mund të zgjidhni pamjen.', [
          { text: 'Light', onPress: () => setIsDark(false) },
          { text: 'Dark', onPress: () => setIsDark(true) },
          { text: 'Cancel', style: 'cancel' },
        ]);
      },
    },
    {
      icon: Bug,
      title: 'Raporto problem',
      rightElement: <ChevronRight size={18} color="#94a3b8" />,
      color: 'text-slate-900',
      bgColor: 'bg-slate-50',
      onPress: () => setShowBugModal(true),
    },
    {
      icon: Trash2,
      title: 'Fshij llogarinë',
      rightElement: <ChevronRight size={18} color="#94a3b8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: '#ef4444',
      onPress: () => setShowDeleteModal(true),
    },
  ];

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
          
          {/* Header Profile Section */}
          <View className="items-center pt-8 pb-8 px-6 bg-white border-b border-slate-100 rounded-b-[32px]">
             <View className="h-24 w-24 rounded-full bg-slate-100 items-center justify-center border-4 border-white shadow-sm mb-4">
                {user ? (
                   <Text className="text-3xl font-bold text-slate-400">
                     {profile?.full_name?.charAt(0) || "U"}
                   </Text>
                ) : (
                   <User size={40} color="#94a3b8" />
                )}
             </View>
             
             {user ? (
               <>
                 <Text className="text-2xl font-bold text-slate-900 mb-1">
                   {profile?.full_name || "Përdorues"}
                 </Text>
                 <Text className="text-slate-500 text-sm">
                   {user.email}
                 </Text>
               </>
             ) : (
               <>
                 <Text className="text-2xl font-bold text-slate-900 mb-2">
                   Mirësevini
                 </Text>
                 <Text className="text-slate-500 text-sm text-center max-w-[250px] leading-5">
                   Hyni në llogari për të ruajtur progresin dhe statistikat tuaja.
                 </Text>
                 <Button 
                   label="Hyni në llogari" 
                   onPress={() => navigation.navigate('Login')}
                   className="mt-6 bg-slate-900 px-8 rounded-full h-12"
                   textClassName="text-white font-semibold"
                 />
               </>
             )}
          </View>

          {/* Subscription Card (Minimal) */}
          {user && (
            <View className="px-6 mt-6">
               <View className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <View className="flex-row justify-between items-start mb-4">
                     <View>
                        <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                           Statusi i Llogarisë
                        </Text>
                        <Text className="text-lg font-bold text-slate-900">
                           {activePlan ? `Premium ${activePlan.category}` : 'Falas'}
                        </Text>
                     </View>
                     {activePlan ? (
                        <View className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                           <Text className="text-indigo-600 text-[10px] font-bold uppercase">Aktiv</Text>
                        </View>
                     ) : (
                        <View className="bg-slate-100 px-3 py-1 rounded-full">
                           <Text className="text-slate-500 text-[10px] font-bold uppercase">Free</Text>
                        </View>
                     )}
                  </View>

                  {activePlan ? (
                     <View>
                        <View className="flex-row justify-between mb-2">
                           <Text className="text-xs text-slate-500">Skadon më</Text>
                           <Text className="text-xs font-medium text-slate-900">
                              {new Date(activePlan.end_date).toLocaleDateString('sq-AL')}
                           </Text>
                        </View>
                        <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <View 
                              className="h-full bg-indigo-600 rounded-full" 
                              style={{ width: `${progress}%` }} 
                           />
                        </View>
                     </View>
                  ) : (
                     <TouchableOpacity 
                        onPress={() => navigation.navigate('Subscription')}
                        className="bg-slate-900 py-3 rounded-xl items-center active:opacity-90"
                     >
                        <Text className="text-white font-semibold text-sm">Upgrade to Premium</Text>
                     </TouchableOpacity>
                  )}
               </View>
            </View>
          )}

          {/* Tools Section */}
          <View className="px-6 mt-8">
             <Text className="text-sm font-bold text-slate-900 mb-3 px-1">Cilësimet</Text>
             <View className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                {toolsItems.map((item, index) => (
                   <TouchableOpacity
                      key={index}
                      onPress={item.onPress}
                      activeOpacity={0.7}
                      className={clsx(
                         "flex-row items-center p-4 active:bg-slate-50",
                         index !== toolsItems.length - 1 && "border-b border-slate-50"
                      )}
                   >
                      <View className={clsx("h-9 w-9 rounded-xl items-center justify-center mr-3", item.bgColor)}>
                         <item.icon size={18} color={item.iconColor || "#334155"} />
                      </View>
                      <Text className={clsx("flex-1 text-[15px] font-medium", item.color)}>
                         {item.title}
                      </Text>
                      {item.rightElement}
                   </TouchableOpacity>
                ))}
             </View>
          </View>

          {/* Socials (Minimal Row) */}
          <View className="px-6 mt-8 mb-4">
             <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Sociale</Text>
             <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 bg-white py-3 rounded-2xl border border-slate-100 items-center justify-center shadow-sm">
                   <Instagram size={20} color="#E1306C" />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-white py-3 rounded-2xl border border-slate-100 items-center justify-center shadow-sm">
                   <Facebook size={20} color="#1877F2" />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-white py-3 rounded-2xl border border-slate-100 items-center justify-center shadow-sm">
                   <Monitor size={20} color="#000000" />
                </TouchableOpacity>
             </View>
          </View>

          {user && (
            <View className="px-6 mt-4">
               <Button 
                 label="Dil nga llogaria" 
                 variant="ghost" 
                 onPress={signOut} 
                 className="py-2"
                 textClassName="text-red-500 text-sm font-medium"
               />
            </View>
          )}

        </ScrollView>
        <ReportBugModal visible={showBugModal} onClose={() => setShowBugModal(false)} />
        <DeleteAccountModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
      </SafeAreaView>
    </View>
  );
};

