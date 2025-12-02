import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, User, Mail, Lock } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Update profile
      // @ts-ignore - suppression for strict typing if needed
      const { error } = await (supabase
        .from('user_profiles') as any)
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      // Update auth metadata as well for consistency
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      Alert.alert('Sukses', 'Të dhënat u përditësuan me sukses.');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Gabim', 'Ndodhi një gabim gjatë përditësimit.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      // Create deep link URL for password reset redirect
      // Use direct scheme in dev for reliable testing with Expo Go
      const redirectUrl = __DEV__ 
        ? 'drivewise://reset-password'
        : Linking.createURL('reset-password');
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: redirectUrl,
      });
      if (error) throw error;
      Alert.alert('Email u dërgua', `Një email për ndryshimin e fjalëkalimit është dërguar në ${user.email}.`);
    } catch (error: any) {
      Alert.alert('Gabim', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top']}>
      <View className="px-6 py-4 flex-row items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <ChevronLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 dark:text-white">Të dhënat personale</Text>
      </View>

      <View className="p-6 gap-6">
        {/* Email (Read Only) */}
        <View>
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">EMAIL</Text>
          <View className="flex-row items-center border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-100 dark:bg-slate-800">
            <Mail size={20} color="#94a3b8" className="mr-3" />
            <Text className="text-slate-500 dark:text-slate-400 font-medium">{user?.email}</Text>
            <View className="ml-auto bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
              <Text className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">JO E EDITUESHME</Text>
            </View>
          </View>
        </View>

        {/* Display Name */}
        <View>
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">EMRI I PLOTË</Text>
          <View className="flex-row items-center border border-slate-300 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 focus:border-blue-500">
            <User size={20} color="#1e1b4b" className="mr-3" />
            <TextInput 
              value={fullName}
              onChangeText={setFullName}
              className="flex-1 text-slate-900 dark:text-white font-medium text-base"
              placeholder="Shkruani emrin tuaj"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Password */}
        <View>
          <Text className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">FJALËKALIMI</Text>
          <View className="flex-row items-center border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 justify-between">
            <View className="flex-row items-center">
              <Lock size={20} color="#1e1b4b" className="mr-3" />
              <Text className="text-slate-900 dark:text-white font-medium">••••••••</Text>
            </View>
            <TouchableOpacity onPress={handleResetPassword}>
              <Text className="text-[#3b82f6] font-bold text-sm">Ndrysho</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Për të ndryshuar fjalëkalimin, ne do t'ju dërgojmë një email konfirmimi.
          </Text>
        </View>

        <Button 
          label={loading ? "Duke ruajtur..." : "Ruaj ndryshimet"}
          onPress={handleUpdate}
          className="mt-4 bg-[#1e1b4b] dark:bg-indigo-600"
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};


