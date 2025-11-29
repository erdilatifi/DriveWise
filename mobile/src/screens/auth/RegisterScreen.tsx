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
  User,
  Mail,
  Lock,
} from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { registerSchema, RegisterSchema } from './validations';
import { AuthStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterSchema) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      });

      if (error) throw error;

      navigation.reset({
        index: 0,
        routes: [{ name: 'App' as any }],
      });
    } catch (err: any) {
      setError(err.message || 'Ndodhi një gabim gjatë regjistrimit');
    } finally {
      setLoading(false);
    }
  };

  const hasNameError = !!errors.full_name;
  const hasEmailError = !!errors.email;
  const hasPasswordError = !!errors.password;
  const hasConfirmError = !!errors.confirmPassword;

  return (
    <View className="flex-1 bg-black">
      {/* Background gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient blobs */}
      <View className="absolute top-10 right-[-60] h-72 w-72 rounded-full bg-[#ce76c9]/20 blur-3xl" />
      <View className="absolute bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

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
            <View className="px-8 mt-4 mb-8">
              <Text className="text-white text-[32px] font-bold leading-tight">
                Krijoni Llogari 🚀
              </Text>
              <Text className="text-gray-400 text-[15px] mt-2 leading-6">
                Bashkohuni me DriveWise dhe filloni rrugëtimin tuaj drejt patentës.
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

              {/* FULL NAME */}
              <View className="mb-5">
                <Text className="text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Emri i plotë
                </Text>
                <View
                  className={`flex-row items-center rounded-2xl px-4 py-3 border bg-gray-50 ${
                    hasNameError
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-100'
                  }`}
                >
                  {/* @ts-ignore */}
                  <User
                    size={20}
                    color={hasNameError ? '#ef4444' : '#9ca3af'}
                    className="mr-3"
                  />
                  <Controller
                    control={control}
                    name="full_name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="Emri Mbiemri"
                        placeholderTextColor="#9ca3af"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="words"
                      />
                    )}
                  />
                  {dirtyFields.full_name && !errors.full_name && (
                    // @ts-ignore
                    <Check size={18} color="#22c55e" />
                  )}
                </View>
                {errors.full_name?.message && (
                  <Text className="mt-1.5 text-[12px] font-medium text-red-500">
                    {errors.full_name.message}
                  </Text>
                )}
              </View>

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
                    className="mr-3"
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
              <View className="mb-5">
                <Text className="text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Fjalëkalimi
                </Text>
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
                    className="mr-3"
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

              {/* CONFIRM PASSWORD */}
              <View className="mb-2">
                <Text className="text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Konfirmo Fjalëkalimin
                </Text>
                <View
                  className={`flex-row items-center rounded-2xl px-4 py-3 border bg-gray-50 ${
                    hasConfirmError
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-100'
                  }`}
                >
                  {/* @ts-ignore */}
                  <Lock
                    size={20}
                    color={hasConfirmError ? '#ef4444' : '#9ca3af'}
                    className="mr-3"
                  />
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.textInput, { flex: 1 }]}
                        placeholder="••••••••"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={!showConfirmPassword}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
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
                {errors.confirmPassword?.message && (
                  <Text className="mt-1.5 text-[12px] font-medium text-red-500">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              {/* SIGN UP BUTTON */}
              <LinearGradient
                colors={['#ce76c9', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="mt-8 rounded-2xl shadow-lg shadow-purple-500/30"
              >
                <Button
                  label={loading ? 'DUKE U REGJISTRUAR...' : 'REGJISTROHU'}
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                  className="h-14 rounded-2xl bg-transparent"
                  textClassName="text-[16px] font-bold tracking-wider text-white"
                />
              </LinearGradient>

              {/* Bottom text */}
              <View className="mt-8 items-center flex-row justify-center">
                <Text className="text-[14px] text-gray-500">
                  Keni llogari?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                   <Text className="text-[14px] font-bold text-[#ce76c9]">
                     Hyr
                   </Text>
                </TouchableOpacity>
              </View>
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
