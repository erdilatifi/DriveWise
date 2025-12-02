import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Image, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme';
import { useUserPlans } from '@drivewise/core';
import { Button } from '../../components/ui/Button';
import { User, Bell, Moon, Smartphone, Key, RefreshCcw, LogOut, ChevronRight, MessageCircle, Instagram, Facebook, AlertCircle, CreditCard, Volume2, Sun, Monitor, Clock, Bug, Trash2 } from 'lucide-react-native';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { ReportBugModal } from '../../components/modals/ReportBugModal';
import { DeleteAccountModal } from '../../components/modals/DeleteAccountModal';
import { ProfileSkeleton } from '../../components/skeletons/ProfileSkeleton';

export const ProfileScreen = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { themeMode, setThemeMode, isDark, colors } = useTheme();
  const { data: plans, isLoading: plansLoading } = useUserPlans(user?.id);
  const navigation = useNavigation<any>();
  
  const [showBugModal, setShowBugModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = React.useState(false);

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

  // Dynamic chevron color based on theme
  const chevronColor = isDark ? "#64748b" : "#94a3b8";

  const toolsItems = [
    ...(user ? [{
      icon: User,
      title: 'Të dhënat personale',
      rightElement: <ChevronRight size={18} color={chevronColor} />,
      color: 'text-slate-900 dark:text-white',
      bgColor: 'bg-slate-50 dark:bg-slate-800',
      onPress: () => navigation.navigate('PersonalInfo'),
    }] : []),
    ...(user ? [{
      icon: Clock,
      title: 'Historiku i Testeve',
      rightElement: <ChevronRight size={18} color={chevronColor} />,
      color: 'text-slate-900 dark:text-white',
      bgColor: 'bg-slate-50 dark:bg-slate-800',
      onPress: () => navigation.navigate('TestHistory'),
    }] : []),
    {
      icon: CreditCard,
      title: 'Pakot',
      rightElement: <ChevronRight size={18} color={chevronColor} />,
      color: 'text-slate-900 dark:text-white',
      bgColor: 'bg-slate-50 dark:bg-slate-800',
      onPress: () => navigation.navigate('Subscription'),
    },
    {
      icon: Sun,
      title: 'Pamja',
      rightElement: <Text className="text-slate-400 dark:text-slate-500 text-xs font-medium capitalize">{themeMode}</Text>,
      color: 'text-slate-900 dark:text-white',
      bgColor: 'bg-slate-50 dark:bg-slate-800',
      onPress: () => setIsThemeExpanded(!isThemeExpanded),
    },
    {
      icon: Bug,
      title: 'Raporto problem',
      rightElement: <ChevronRight size={18} color={chevronColor} />,
      color: 'text-slate-900 dark:text-white',
      bgColor: 'bg-slate-50 dark:bg-slate-800',
      onPress: () => setShowBugModal(true),
    },
    ...(user ? [{
      icon: Trash2,
      title: 'Fshij llogarinë',
      rightElement: <ChevronRight size={18} color="#f87171" />,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: '#ef4444',
      onPress: () => setShowDeleteModal(true),
    }] : []),
  ];

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }} showsVerticalScrollIndicator={false}>
          
          {/* Header Profile Section */}
          <View className="items-center pt-8 pb-8 px-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px]">
             <View className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm mb-4">
                {user ? (
                   <Text className="text-3xl font-bold text-slate-400 dark:text-slate-500">
                     {profile?.full_name?.charAt(0) || "U"}
                   </Text>
                ) : (
                   <User size={40} color="#94a3b8" />
                )}
             </View>
             
             {user ? (
               <>
                 <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                   {profile?.full_name || "Përdorues"}
                 </Text>
                 <Text className="text-slate-500 dark:text-slate-400 text-sm">
                   {user.email}
                 </Text>
               </>
             ) : (
               <>
                 <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                   Mirësevini
                 </Text>
                 <Text className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-[250px] leading-5">
                   Hyni në llogari për të ruajtur progresin dhe statistikat tuaja.
                 </Text>
                 <Button 
                   label="Hyni në llogari" 
                   onPress={() => navigation.navigate('Login')}
                   className="mt-6 bg-slate-900 dark:bg-slate-700 px-8 rounded-full h-12"
                   textClassName="text-white font-semibold"
                 />
               </>
             )}
          </View>

          {/* Subscription Card (Minimal) */}
          {user && (
            <View className="px-6 mt-6">
               <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <View className="flex-row justify-between items-start mb-4">
                     <View>
                        <Text className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                           Statusi i Llogarisë
                        </Text>
                        <Text className="text-lg font-bold text-slate-900 dark:text-white">
                           {activePlan ? `Premium ${activePlan.category}` : 'Falas'}
                        </Text>
                     </View>
                     {activePlan ? (
                        <View className="bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/30">
                           <Text className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">Aktiv</Text>
                        </View>
                     ) : (
                        <View className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                           <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">Free</Text>
                        </View>
                     )}
                  </View>

                  {activePlan ? (
                     <View>
                        <View className="flex-row justify-between mb-2">
                           <Text className="text-xs text-slate-500 dark:text-slate-400">Skadon më</Text>
                           <Text className="text-xs font-medium text-slate-900 dark:text-white">
                              {new Date(activePlan.end_date).toLocaleDateString('sq-AL')}
                           </Text>
                        </View>
                        <View className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                           <View 
                              className="h-full bg-indigo-600 rounded-full" 
                              style={{ width: `${progress}%` }} 
                           />
                        </View>
                     </View>
                  ) : (
                     <TouchableOpacity 
                        onPress={() => navigation.navigate('Subscription')}
                        className="bg-slate-900 dark:bg-indigo-600 py-3 rounded-xl items-center active:opacity-90"
                     >
                        <Text className="text-white font-semibold text-sm">Upgrade to Premium</Text>
                     </TouchableOpacity>
                  )}
               </View>
            </View>
          )}

          {/* Tools Section */}
          <View className="px-6 mt-8">
             <Text className="text-sm font-bold text-slate-900 dark:text-white mb-3 px-1">Cilësimet</Text>
             <View className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                {toolsItems.map((item, index) => (
                   <React.Fragment key={index}>
                     <TouchableOpacity
                        onPress={item.onPress}
                        activeOpacity={0.7}
                        className={clsx(
                           "flex-row items-center p-4 active:bg-slate-50 dark:active:bg-slate-800",
                           index !== toolsItems.length - 1 && "border-b border-slate-50 dark:border-slate-800"
                        )}
                     >
                        <View className={clsx("h-9 w-9 rounded-xl items-center justify-center mr-3", item.bgColor)}>
                           <item.icon size={18} color={item.iconColor || (isDark ? "#e2e8f0" : "#334155")} />
                        </View>
                        <Text className={clsx("flex-1 text-[15px] font-medium", item.color)}>
                           {item.title}
                        </Text>
                        {item.rightElement}
                     </TouchableOpacity>
                     
                     {/* Theme Picker Dropdown */}
                     {item.title === 'Pamja' && isThemeExpanded && (
                        <View className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-50 dark:border-slate-800">
                           {(['system', 'light', 'dark'] as const).map((t) => (
                              <TouchableOpacity 
                                 key={t} 
                                 onPress={() => {
                                    setThemeMode(t);
                                    setIsThemeExpanded(false); // Close dropdown after selection
                                 }}
                                 className={clsx(
                                    "flex-row items-center justify-between py-3 px-3 rounded-xl mb-1",
                                    themeMode === t ? "bg-white dark:bg-slate-700 shadow-sm" : ""
                                 )}
                              >
                                 <View className="flex-row items-center">
                                    {t === 'system' && <Monitor size={16} color={isDark ? "#94a3b8" : "#64748b"} style={{ marginRight: 8 }} />}
                                    {t === 'light' && <Sun size={16} color="#f59e0b" style={{ marginRight: 8 }} />}
                                    {t === 'dark' && <Moon size={16} color="#6366f1" style={{ marginRight: 8 }} />}
                                    <Text className={clsx(
                                       "text-sm font-medium capitalize",
                                       themeMode === t ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"
                                    )}>
                                       {t === 'system' ? 'Sistemi' : t === 'light' ? 'Dritë' : 'Errët'}
                                    </Text>
                                 </View>
                                 {themeMode === t && <View className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                              </TouchableOpacity>
                           ))}
                        </View>
                     )}
                   </React.Fragment>
                ))}
             </View>
          </View>

          {/* Socials (Minimal Row) */}
          <View className="px-6 mt-8 mb-4">
             <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Sociale</Text>
             <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 bg-white dark:bg-slate-900 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 items-center justify-center shadow-sm">
                   <Instagram size={20} color="#E1306C" />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-white dark:bg-slate-900 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 items-center justify-center shadow-sm">
                   <Facebook size={20} color="#1877F2" />
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-white dark:bg-slate-900 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 items-center justify-center shadow-sm">
                   <Monitor size={20} color={isDark ? "white" : "#000000"} />
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



