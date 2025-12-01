import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Check,
  Eye,
  EyeOff,
  MoreHorizontal,
  Mail,
  Lock,
  CheckCircle,
} from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { loginSchema, LoginSchema } from './validations';
import { AuthStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // Translate Supabase error messages to Albanian
  const translateError = (message: string): string => {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email ose fjalëkalimi i pasaktë',
      'Email not confirmed': 'Email-i nuk është konfirmuar. Kontrolloni email-in tuaj.',
      'User not found': 'Përdoruesi nuk u gjet',
      'Invalid email': 'Email adresa nuk është e vlefshme',
      'Password should be at least 6 characters': 'Fjalëkalimi duhet të ketë të paktën 6 karaktere',
      'Email rate limit exceeded': 'Keni bërë shumë tentativa. Provoni përsëri më vonë.',
      'Network request failed': 'Gabim në lidhje. Kontrolloni internetin tuaj.',
      'Too many requests': 'Shumë tentativa. Prisni pak minuta.',
    };
    
    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return message;
  };

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      navigation.reset({
        index: 0,
        routes: [{ name: 'App' as any }],
      });
    } catch (err: any) {
      setError(translateError(err.message) || 'Ndodhi një gabim gjatë hyrjes');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      setForgotError('Ju lutem vendosni email adresën');
      return;
    }
    setForgotLoading(true);
    setForgotError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: 'drivewise://reset-password',
      });
      if (error) throw error;
      setForgotSuccess(true);
    } catch (err: any) {
      setForgotError(err.message || 'Ndodhi një gabim');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotSuccess(false);
    setForgotError(null);
  };

  const hasEmailError = !!errors.email;
  const hasPasswordError = !!errors.password;

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
        start={{ x: 0.3, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={{ position: 'absolute', top: -120, left: -150, width: 400, height: 400 }}
      />
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.3)', 'rgba(79, 70, 229, 0.1)', 'transparent']}
        start={{ x: 0.7, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 100, right: -100, width: 350, height: 350 }}
      />
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.15)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', bottom: 200, left: -50, width: 200, height: 200 }}
      />

      <SafeAreaView edges={['top']} className="flex-none">
        <View className="flex-row justify-between px-6 pt-2 items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
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
            {/* Header / Hero */}
            <View className="px-8 mt-6 mb-8">
              <View className="flex-row items-center gap-3 mb-5">
                <LinearGradient
                  colors={['#ce76c9', '#a855f7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-10 w-10 rounded-2xl items-center justify-center shadow-lg shadow-purple-500/30"
                >
                  <Text className="text-white font-extrabold text-xl">DW</Text>
                </LinearGradient>
                <View>
                  <Text className="text-xs text-gray-300 tracking-[0.18em] uppercase font-medium">
                    DriveWise
                  </Text>
                  <Text className="text-white font-semibold text-lg">
                    Portali i Studentit
                  </Text>
                </View>
              </View>

              <Text className="text-white text-[32px] font-bold leading-tight">
                Mirësevini 👋
              </Text>
              <Text className="text-gray-400 text-[15px] mt-2 leading-6">
                Hyni për të vazhduar mësimin. Patenta juaj është vetëm pak hapa larg.
              </Text>
            </View>

            {/* Card */}
            <View className="flex-1 bg-white rounded-t-[32px] px-7 pt-8 pb-8 shadow-2xl">
              
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

              {/* EMAIL FIELD */}
              <View className="mb-5">
                <Text className="text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Email Adresa
                </Text>
                <View
                  className={`flex-row items-center rounded-2xl px-4 py-3 border bg-gray-50 ${
                    hasEmailError
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-100'
                  }`}
                >
                  {/* @ts-ignore */}
                  <Mail
                    size={20}
                    color={hasEmailError ? '#ef4444' : '#9ca3af'}
                    style={{ marginRight: 12 }}
                  />
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="emri@shembull.com"
                        placeholderTextColor="#9ca3af"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    )}
                  />
                  {dirtyFields.email && !errors.email && (
                    // @ts-ignore
                    <Check size={18} color="#22c55e" />
                  )}
                </View>
                {errors.email?.message && (
                  <Text className="mt-1.5 text-[12px] font-medium text-red-500">
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* PASSWORD FIELD */}
              <View className="mb-2">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                    Fjalëkalimi
                  </Text>
                  <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
                    <Text className="text-[12px] font-semibold text-[#ce76c9]">
                      Harruat fjalëkalimin?
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  className={`flex-row items-center rounded-2xl px-4 py-3 border bg-gray-50 ${
                    hasPasswordError
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-100'
                  }`}
                >
                  {/* @ts-ignore */}
                  <Lock
                    size={20}
                    color={hasPasswordError ? '#ef4444' : '#9ca3af'}
                    style={{ marginRight: 12 }}
                  />
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="••••••••"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showPassword}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
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
                {errors.password?.message && (
                  <Text className="mt-1.5 text-[12px] font-medium text-red-500">
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* SIGN IN BUTTON */}
              <LinearGradient
                colors={['#ce76c9', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="mt-8 rounded-2xl shadow-lg shadow-purple-500/30"
              >
                <Button
                  label={loading ? 'DUKE HYRË...' : 'HYR'}
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  className="h-14 rounded-2xl bg-transparent"
                  textClassName="text-[16px] font-bold tracking-wider text-white"
                />
              </LinearGradient>

              {/* Bottom text */}
              <View className="mt-8 items-center flex-row justify-center">
                <Text className="text-[14px] text-gray-500">
                  Nuk keni llogari?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.replace('Register')}>
                   <Text className="text-[14px] font-bold text-[#ce76c9]">
                     Regjistrohu
                   </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPassword}
        animationType="slide"
        transparent={true}
        onRequestClose={closeForgotModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-[32px] px-6 pt-6 pb-10">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-900">Rivendos Fjalëkalimin</Text>
              <TouchableOpacity onPress={closeForgotModal} className="p-2 bg-slate-100 rounded-full">
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {forgotSuccess ? (
              <View className="items-center py-8">
                <View className="h-16 w-16 rounded-full bg-green-100 items-center justify-center mb-4">
                  <CheckCircle size={32} color="#22c55e" />
                </View>
                <Text className="text-lg font-bold text-slate-900 mb-2">Email u dërgua!</Text>
                <Text className="text-slate-500 text-center leading-6">
                  Kontrolloni email-in tuaj ({forgotEmail}) për udhëzimet e rivendosjes së fjalëkalimit.
                </Text>
                <TouchableOpacity 
                  onPress={closeForgotModal}
                  className="mt-6 bg-slate-900 px-8 py-3 rounded-2xl"
                >
                  <Text className="text-white font-semibold">U kuptua</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text className="text-slate-500 mb-6 leading-6">
                  Vendosni email adresën tuaj dhe do t'ju dërgojmë udhëzimet për rivendosjen e fjalëkalimit.
                </Text>

                {forgotError && (
                  <View className="mb-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
                    <Text className="text-[13px] font-medium text-red-600">{forgotError}</Text>
                  </View>
                )}

                <View className="flex-row items-center rounded-2xl px-4 py-3 border border-gray-100 bg-gray-50 mb-6">
                  <Mail size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder="emri@shembull.com"
                    placeholderTextColor="#9ca3af"
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <LinearGradient
                  colors={['#ce76c9', '#a855f7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-2xl"
                >
                  <Button
                    label={forgotLoading ? 'DUKE DËRGUAR...' : 'DËRGO EMAIL'}
                    onPress={handleForgotPassword}
                    loading={forgotLoading}
                    className="h-14 rounded-2xl bg-transparent"
                    textClassName="text-[16px] font-bold tracking-wider text-white"
                  />
                </LinearGradient>
              </>
            )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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


