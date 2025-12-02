import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import {
  X,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
} from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Handle the deep link tokens when this screen mounts
    const handleDeepLinkTokens = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await extractAndSetSession(initialUrl);
        }
      } catch (err) {
        console.error('Error handling deep link:', err);
      }
    };

    handleDeepLinkTokens();

    // Also listen for URL changes
    const subscription = Linking.addEventListener('url', async (event) => {
      if (event.url.includes('reset-password')) {
        await extractAndSetSession(event.url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const extractAndSetSession = async (url: string) => {
    try {
      // Parse tokens from URL hash
      const urlObj = new URL(url.replace('drivewise://', 'https://app.drivewise.com/'));
      const hashParams = new URLSearchParams(urlObj.hash.replace('#', ''));
      
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (type === 'recovery' && accessToken && refreshToken) {
        // Set session for password update
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session:', error);
          setError('Linku ka skaduar ose është i pavlefshëm. Provoni përsëri.');
          return;
        }

        setSessionReady(true);
      } else if (hashParams.get('error')) {
        setError(hashParams.get('error_description') || 'Linku ka skaduar.');
      }
    } catch (err) {
      console.error('Error extracting session:', err);
      setError('Ndodhi një gabim. Provoni përsëri.');
    }
  };

  const handleResetPassword = async () => {
    if (!password.trim()) {
      setError('Ju lutem vendosni fjalëkalimin e ri');
      return;
    }
    if (password.length < 6) {
      setError('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
      return;
    }
    if (password !== confirmPassword) {
      setError('Fjalëkalimet nuk përputhen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      
      // Sign out after password change for security
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(err.message || 'Ndodhi një gabim gjatë ndryshimit të fjalëkalimit');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View className="flex-1 bg-black">
      {/* Background gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient gradient lights */}
      <LinearGradient
        colors={['rgba(206, 118, 201, 0.35)', 'rgba(168, 85, 247, 0.08)', 'transparent']}
        start={{ x: 0.7, y: 0 }}
        end={{ x: 0, y: 0.8 }}
        style={{ position: 'absolute', top: -80, right: -120, width: 380, height: 380 }}
      />
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.3)', 'rgba(79, 70, 229, 0.1)', 'transparent']}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', bottom: 50, left: -120, width: 320, height: 320 }}
      />

      <SafeAreaView edges={['top']} className="flex-none">
        <View className="flex-row justify-between px-6 pt-2 items-center">
          <TouchableOpacity
            onPress={goToLogin}
            className="p-2 bg-white/10 rounded-full border border-white/10"
          >
            {/* @ts-ignore */}
            <X size={22} color="#f9fafb" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="flex-1 justify-between">
            {/* Header */}
            <View className="px-8 mt-4 mb-8">
              <Text className="text-white text-[32px] font-bold leading-tight">
                Rivendos Fjalëkalimin 🔐
              </Text>
              <Text className="text-gray-400 text-[15px] mt-2 leading-6">
                Vendosni fjalëkalimin tuaj të ri më poshtë.
              </Text>
            </View>

            {/* Card */}
            <View className="flex-1 bg-white rounded-t-[32px] px-7 pt-8 pb-8 shadow-2xl">
              {success ? (
                <View className="items-center py-8">
                  <View className="h-20 w-20 rounded-full bg-green-100 items-center justify-center mb-6">
                    {/* @ts-ignore */}
                    <CheckCircle size={40} color="#22c55e" />
                  </View>
                  <Text className="text-2xl font-bold text-slate-900 mb-3">
                    Fjalëkalimi u ndryshua!
                  </Text>
                  <Text className="text-slate-500 text-center leading-6 mb-8">
                    Fjalëkalimi juaj u rivendos me sukses. Tani mund të hyni me fjalëkalimin e ri.
                  </Text>
                  <LinearGradient
                    colors={['#ce76c9', '#a855f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="rounded-2xl w-full"
                  >
                    <Button
                      label="HYR NË LLOGARI"
                      onPress={goToLogin}
                      className="h-14 rounded-2xl bg-transparent"
                      textClassName="text-[16px] font-bold tracking-wider text-white"
                    />
                  </LinearGradient>
                </View>
              ) : !sessionReady ? (
                <View className="items-center py-8">
                  <Text className="text-slate-500 text-center leading-6">
                    {error || 'Duke verifikuar linkun...'}
                  </Text>
                  {error && (
                    <TouchableOpacity 
                      onPress={goToLogin}
                      className="mt-6 bg-slate-900 px-8 py-3 rounded-2xl"
                    >
                      <Text className="text-white font-semibold">Kthehu te Hyrja</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <>
                  {/* Error banner */}
                  {error && (
                    <View className="mb-5 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 flex-row items-center">
                      <View className="h-6 w-6 rounded-full bg-red-100 items-center justify-center mr-3">
                        <Text className="text-[14px] font-bold text-red-600">!</Text>
                      </View>
                      <Text className="flex-1 text-[13px] font-medium text-red-600">
                        {error}
                      </Text>
                    </View>
                  )}

                  {/* NEW PASSWORD FIELD */}
                  <View className="mb-5">
                    <Text className="text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                      Fjalëkalimi i Ri
                    </Text>
                    <View className="flex-row items-center rounded-2xl px-4 py-3 border bg-gray-50 border-gray-100">
                      {/* @ts-ignore */}
                      <Lock
                        size={20}
                        color="#9ca3af"
                        style={{ marginRight: 12 }}
                      />
                      <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="••••••••"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showPassword}
                        onChangeText={setPassword}
                        value={password}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="pl-2"
                      >
                        {/* @ts-ignore */}
                        {showPassword ? (
                          <Eye size={20} color="#6b7280" />
                        ) : (
                          <EyeOff size={20} color="#9ca3af" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* CONFIRM PASSWORD FIELD */}
                  <View className="mb-2">
                    <Text className="text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                      Konfirmo Fjalëkalimin
                    </Text>
                    <View className="flex-row items-center rounded-2xl px-4 py-3 border bg-gray-50 border-gray-100">
                      {/* @ts-ignore */}
                      <Lock
                        size={20}
                        color="#9ca3af"
                        style={{ marginRight: 12 }}
                      />
                      <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="••••••••"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showConfirmPassword}
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="pl-2"
                      >
                        {/* @ts-ignore */}
                        {showConfirmPassword ? (
                          <Eye size={20} color="#6b7280" />
                        ) : (
                          <EyeOff size={20} color="#9ca3af" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* SUBMIT BUTTON */}
                  <LinearGradient
                    colors={['#ce76c9', '#a855f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="mt-8 rounded-2xl shadow-lg shadow-purple-500/30"
                  >
                    <Button
                      label={loading ? 'DUKE RUAJTUR...' : 'RUAJ FJALËKALIMIN'}
                      onPress={handleResetPassword}
                      loading={loading}
                      className="h-14 rounded-2xl bg-transparent"
                      textClassName="text-[16px] font-bold tracking-wider text-white"
                    />
                  </LinearGradient>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
});
