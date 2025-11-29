import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  AppState,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useCategory } from "../../contexts/CategoryContext";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import {
  Check,
  Crown,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
} from "lucide-react-native";
import { clsx } from "clsx";
import {
  BILLING_CONFIG,
  PaidPlanTier,
  useUserPlans,
  useCategoryEntitlements,
} from "@drivewise/core";
import { ENV } from "../../config/env";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Subscription"
>;

export const SubscriptionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedCategory } = useCategory();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const [selectedPlan, setSelectedPlan] = useState<PaidPlanTier>(
    BILLING_CONFIG.bestValuePlan
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch plans / entitlements
  const { data: plans, refetch: refetchPlans } = useUserPlans(user?.id);
  const { data: entitlements, refetch: refetchEntitlements } =
    useCategoryEntitlements(
      user?.id,
      selectedCategory as any,
      profile?.is_admin || false
    );

  const isActive = entitlements?.plan?.isActive;
  const activeExpiryDate = entitlements?.plan?.endDate;

  const refreshStatus = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["user-plans"] }),
      queryClient.invalidateQueries({ queryKey: ["category-entitlements"] }),
      refetchPlans(),
      refetchEntitlements(),
    ]);
    setRefreshing(false);
  };

  // Auto-refresh when returning to app
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        refreshStatus();
      }
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh when screen gains focus
  useFocusEffect(
    useCallback(() => {
      refreshStatus();
    }, [])
  );

  const handlePurchase = async () => {
    if (!user) {
      navigation.navigate("Login" as any);
      return;
    }
    if (!selectedCategory) return;

    setLoading(true);
    try {
      const urlObj = new URL(`${ENV.WEB_APP_URL}/pricing`);

      urlObj.searchParams.set("category", selectedCategory);
      urlObj.searchParams.set("plan", selectedPlan);
      if (user.email) {
        urlObj.searchParams.set("email", user.email);
      }

      const url = urlObj.toString();
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Gabim", "Nuk mund të hapim shfletuesin.");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert(
        "Gabim",
        "Ndodhi një problem gjatë hapjes së faqes së pagesës."
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Teste të pakufizuara",
    "Trajneri i Vendimeve i hapur",
    "Materiale Mësimore Premium",
    "Statistika të detajuara",
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshStatus}
              tintColor="#1e1b4b"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-2">
            <View className="mb-6 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="flex-row items-center rounded-full bg-white px-3 py-1 border border-slate-200 shadow-sm"
                activeOpacity={0.8}
              >
                {/* @ts-ignore */}
                <ArrowLeft size={20} color="#334155" />
                <Text className="ml-2 text-sm font-medium text-slate-600">
                  Kthehu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={refreshStatus}
                className="items-center justify-center rounded-full bg-white p-2 border border-slate-200 shadow-sm"
                activeOpacity={0.8}
              >
                {/* @ts-ignore */}
                <RefreshCw size={18} color="#1e1b4b" />
              </TouchableOpacity>
            </View>

            {/* Hero */}
            <View className="mb-8 items-center">
              <View
                className={clsx(
                  "mb-4 h-20 w-20 items-center justify-center rounded-full border-4",
                  isActive
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-[#1e1b4b]/10 border-[#1e1b4b]/30"
                )}
              >
                {/* @ts-ignore */}
                <Crown size={40} color={isActive ? "#22C55E" : "#1e1b4b"} fill={isActive ? "#22C55E" : "#1e1b4b"} />
              </View>

              <Text className="text-center text-3xl font-extrabold text-slate-900">
                {isActive ? "Abonimi Aktiv" : "Bëhu Premium"}
              </Text>
              <Text className="mt-2 text-center text-sm text-slate-500">
                Për kategorinë{" "}
                <Text className="font-semibold text-[#1e1b4b]">
                  {selectedCategory}
                </Text>
              </Text>

              {isActive && activeExpiryDate && (
                <Text className="mt-4 rounded-full bg-green-50 px-4 py-2 text-xs font-medium text-green-600 border border-green-200">
                  Skadon më:{" "}
                  {new Date(activeExpiryDate).toLocaleDateString("sq-AL")}
                </Text>
              )}
            </View>
          </View>

          {/* Features */}
          <View className="mb-8 px-6">
            <View className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Text className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Çfarë përfshin
              </Text>
              {features.map((feature, index) => (
                <View
                  key={index}
                  className={clsx(
                    "mb-3 flex-row items-center",
                    index === features.length - 1 && "mb-0"
                  )}
                >
                  <View className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-[#1e1b4b]">
                    {/* @ts-ignore */}
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <Text className="text-sm font-medium text-slate-700">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Plans (only if not active) */}
          {!isActive && (
            <>
              <View className="mb-8 space-y-4 px-6">
                {Object.values(BILLING_CONFIG.plans).map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  const isBestValue = plan.badge === "BEST_VALUE";

                  return (
                    <TouchableOpacity
                      key={plan.id}
                      onPress={() => setSelectedPlan(plan.id)}
                      activeOpacity={0.9}
                      className={clsx(
                        "relative rounded-3xl border-2 p-6 overflow-hidden",
                        isSelected
                          ? "border-[#1e1b4b] bg-blue-50"
                          : "border-slate-200 bg-white"
                      )}
                    >
                      {/* Decorative background for selected plan */}
                      {isSelected && (
                        <>
                          <View className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[20px] border-[#1e1b4b]/5" />
                          <View className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full bg-[#1e1b4b]/5" />
                        </>
                      )}

                      {isBestValue && (
                        <View className="absolute -top-3 left-6 rounded-full bg-[#1e1b4b] px-3 py-1 shadow-sm z-10 border border-white/20">
                          <Text className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                            Më i vlefshmi
                          </Text>
                        </View>
                      )}

                      <View className="flex-row items-center justify-between relative z-10">
                        <View>
                          <Text
                            className={clsx(
                              "text-xl font-bold",
                              isSelected
                                ? "text-[#1e1b4b]"
                                : "text-slate-900"
                            )}
                          >
                            {plan.label}
                          </Text>
                          <Text className="mt-1 text-sm text-slate-500">
                            {plan.pricePerMonthEur.toFixed(2)}€ / muaj
                          </Text>
                        </View>

                        <View className="items-end">
                          <Text className={clsx(
                              "text-3xl font-extrabold",
                              isSelected ? "text-[#1e1b4b]" : "text-slate-900"
                          )}>
                            {plan.priceEur}€
                          </Text>
                          {isSelected ? (
                            <View className="mt-2 h-6 w-6 items-center justify-center rounded-full bg-[#1e1b4b]">
                              {/* @ts-ignore */}
                              <Check size={14} color="#FFFFFF" />
                            </View>
                          ) : (
                            <View className="mt-2 h-6 w-6 rounded-full border-2 border-slate-300" />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Footer CTA */}
              <View className="px-6 pb-8">
                <Button
                  label="Blej pakon në web"
                  onPress={handlePurchase}
                  loading={loading}
                  className="h-14 bg-[#1e1b4b]"
                  textClassName="text-lg font-bold"
                />
                <View className="mt-4 flex-row items-center justify-center">
                  {/* @ts-ignore */}
                  <ShieldCheck size={14} color="#9CA3AF" />
                  <Text className="ml-1 text-xs text-slate-400">
                    Pagesë e sigurtë përmes Web
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Active footer */}
          {isActive && (
            <View className="px-6">
              <Button
                label="Kthehu në Ballinë"
                onPress={() =>
                  navigation.navigate("App", {
                    screen: "Testet",
                  })
                }
                variant="secondary"
                className="h-14 bg-white border border-slate-200"
                textClassName="text-slate-900"
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

