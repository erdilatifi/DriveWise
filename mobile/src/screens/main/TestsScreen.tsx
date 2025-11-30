import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCategory } from "@/contexts/CategoryContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  useDashboardStats,
  useTestCount,
  useUserPlans,
  useGlobalDailyStreak,
} from "@drivewise/core";
import {
  Lock,
  Target,
  Zap,
  Activity,
  TrendingUp,
  PlayCircle,
  CheckCircle2,
  BookOpen,
  BrainCircuit,
  FileText,
  LogIn,
} from "lucide-react-native";
import { clsx } from "clsx";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "App">;

// DESIGN TOKENS (keep it narrow & consistent)
const PRIMARY = "#4f46e5";
const BG_COLOR = "#F7F8FA";

export const TestsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedCategory } = useCategory();
  const { user, profile } = useAuth();

  const { data: stats, isLoading: statsLoading } = useDashboardStats(user?.id);
  const { data: globalStreak } = useGlobalDailyStreak(user?.id);
  const { data: testCount = 30 } = useTestCount(selectedCategory || "B");
  const { data: plans } = useUserPlans(user?.id);

  const isGuest = !user;

  // Premium access per category
  const hasCategoryAccess = useMemo(() => {
    if (profile?.is_admin) return true;
    return (plans || []).some(
      (p) =>
        p.category === (selectedCategory || "B") && p.status === "active"
    );
  }, [plans, selectedCategory, profile]);

  const validTestCount = testCount && testCount > 0 ? testCount : 30;

  const tests = useMemo(
    () =>
      Array.from({ length: validTestCount }).map((_, i) => {
        const testNum = i + 1;
        const isLocked = !hasCategoryAccess && testNum > 1; // first test free
        return { id: testNum.toString(), isLocked };
      }),
    [validTestCount, hasCategoryAccess]
  );

  if (user && statsLoading) {
    return <DashboardSkeleton />;
  }

  const dashboardStats = stats?.stats || {
    totalTests: 0,
    averageScore: 0,
    streak: 0,
    passedTests: 0,
    failedTests: 0,
  };

  const progressData = stats?.progressData || [];

  // ---------- SUBCOMPONENTS ----------

  const getBarColor = (score: number) => {
    if (score < 30) return "bg-violet-300 dark:bg-violet-900";
    if (score < 70) return "bg-violet-500 dark:bg-violet-600";
    return "bg-violet-700 dark:bg-violet-400";
  };

  const GuestHeader = () => (
    <View className="px-6 pt-8 pb-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px]">
      <Text className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
        Mirësevini në DriveWise
      </Text>
      <Text className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
        Fillo rrugën drejt lejes së vozitjes
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-5 max-w-[280px]">
        Tri seksione të thjeshta për të mësuar, ushtruar dhe provuar veten.
      </Text>

      {/* Three steps – super minimal */}
      <View className="flex-row justify-between mt-8">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Literatura" as any)}
          className="items-center w-1/3"
        >
          <View className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700 mb-2">
            <BookOpen size={20} color={PRIMARY} />
          </View>
          <Text className="text-xs font-semibold text-slate-900 dark:text-slate-200">
            Literatura
          </Text>
          <Text className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 text-center">
            Baza e rregullave
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Trajneri" as any)}
          className="items-center w-1/3"
        >
          <View className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700 mb-2">
            <BrainCircuit size={20} color={PRIMARY} />
          </View>
          <Text className="text-xs font-semibold text-slate-900 dark:text-slate-200">
            Trajneri
          </Text>
          <Text className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 text-center">
            Ushtroni temat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Testet" as any)}
          className="items-center w-1/3"
        >
          <View className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700 mb-2">
            <FileText size={20} color={PRIMARY} />
          </View>
          <Text className="text-xs font-semibold text-slate-900 dark:text-slate-200">
            Testet
          </Text>
          <Text className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 text-center">
            Simuloni provimin
          </Text>
        </TouchableOpacity>
      </View>

      {/* Single clean CTA */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.getParent()?.navigate("Login")}
        className="mt-8 bg-slate-900 dark:bg-indigo-600 py-4 rounded-full flex-row items-center justify-center shadow-sm shadow-slate-200"
      >
        <LogIn size={18} color="white" />
        <Text className="text-white font-bold text-sm ml-2">
          Hyni për të ruajtur progresin
        </Text>
      </TouchableOpacity>
    </View>
  );

  const LoggedInHeader = () => (
    <View className="px-6 pt-8 pb-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[32px]">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            Mirësevini
          </Text>
          <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {profile?.full_name || "Përdorues"}
          </Text>
        </View>
        <View className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 items-center justify-center">
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            {profile?.full_name?.charAt(0) || "U"}
          </Text>
        </View>
      </View>

      {/* 3 small stat chips – all same style */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
          <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Mesatarja
          </Text>
          <View className="flex-row items-end justify-between">
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              {dashboardStats.averageScore}%
            </Text>
            <CheckCircle2 size={18} color={PRIMARY} />
          </View>
        </View>
        <View className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
          <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Testet
          </Text>
          <View className="flex-row items-end justify-between">
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              {dashboardStats.totalTests}
            </Text>
            <FileText size={18} color="#0ea5e9" />
          </View>
        </View>
        <View className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
          <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Seria
          </Text>
          <View className="flex-row items-end justify-between">
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              {globalStreak?.currentStreak || 0}
            </Text>
            <Zap size={18} color="#f97316" />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F7F8FA] dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          {isGuest ? <GuestHeader /> : <LoggedInHeader />}

          {/* Progress (only logged in) */}
          {!isGuest && (
            <View className="px-6 mt-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-semibold text-slate-900 dark:text-white">
                  Progresi i javës
                </Text>
                <TrendingUp size={18} color="#9ca3af" />
              </View>

              <View className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <View className="flex-row items-end justify-between gap-3 h-28">
                  {progressData.length > 0 ? (
                    progressData.map((item, index) => {
                      const height = Math.max(
                        (item.score / 100) * 100,
                        8
                      );
                      const isToday =
                        index === progressData.length - 1;
                      return (
                        <Animated.View
                          key={index}
                          entering={FadeInDown.delay(
                            index * 70
                          ).springify()}
                          className="items-center flex-1"
                        >
                          <View className="w-4 h-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden justify-end mx-auto">
                            <View
                              className={clsx(
                                "w-full rounded-full",
                                getBarColor(item.score)
                              )}
                              style={{ height: `${height}%` }}
                            />
                          </View>
                          <Text
                            className={clsx(
                              "mt-1 text-[9px] font-medium",
                              isToday
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-400 dark:text-slate-600"
                            )}
                            numberOfLines={1}
                          >
                            {item.date}
                          </Text>
                        </Animated.View>
                      );
                    })
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Text className="text-slate-400 text-xs">
                        Ende nuk ka rezultate për këtë javë.
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Quick actions */}
          <View className="px-6 mt-8">
            <Text className="text-base font-semibold text-slate-900 dark:text-white mb-3">
              Fillo testim
            </Text>

            {/* Random test (primary hero card) */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation
                  .getParent()
                  ?.navigate("TestInstructions", {
                    testId: "random",
                    category: selectedCategory!,
                  })
              }
              className="mb-3"
            >
              <LinearGradient
                colors={[PRIMARY, "#6366f1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full rounded-3xl py-4 px-6 flex-row items-center justify-between"
              >
                <View>
                  <Text className="text-indigo-100 text-[11px] font-semibold uppercase tracking-wider">
                    Rekomanduar
                  </Text>
                  <Text className="text-white font-semibold text-lg mt-1">
                    Test i rastit
                  </Text>
                  <Text className="text-indigo-100 text-xs mt-1">
                    30 pyetje të përzgjedhura automatikisht.
                  </Text>
                </View>
                <View className="h-11 w-11 bg-white rounded-full items-center justify-center">
                  <PlayCircle size={26} color={PRIMARY} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Personalized test (neutral card) */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (!hasCategoryAccess) {
                  navigation.getParent()?.navigate("Subscription");
                } else {
                  navigation
                    .getParent()
                    ?.navigate("TestInstructions", {
                      testId: "personalized",
                      category: selectedCategory!,
                    });
                }
              }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl py-4 px-6 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                  Test i personalizuar
                </Text>
                <Text className="text-slate-900 dark:text-white font-semibold text-lg mt-1">
                  Fokus te pikat e dobëta
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Gjenerohet nga gabimet dhe rezultatet tuaja.
                </Text>
              </View>
              <View className="h-11 w-11 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center border border-slate-200 dark:border-slate-700">
                <Activity size={22} color={PRIMARY} />
              </View>
            </TouchableOpacity>
          </View>

          {/* All tests grid */}
          <View className="px-6 mt-10 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-slate-900 dark:text-white">
                Të gjitha testet
              </Text>
              <View className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <Text className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  Kategoria {selectedCategory}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-4">
              {tests.map((test) => (
                <TouchableOpacity
                  key={test.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (test.isLocked) {
                      navigation.getParent()?.navigate("Subscription");
                    } else {
                      navigation
                        .getParent()
                        ?.navigate("TestInstructions", {
                          testId: test.id,
                          category: selectedCategory!,
                        });
                    }
                  }}
                  className="w-[48%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4"
                >
                  <View className="flex-row justify-between items-start mb-6">
                    <View
                      className={clsx(
                        "h-8 w-8 rounded-xl items-center justify-center",
                        test.isLocked ? "bg-slate-50 dark:bg-slate-800" : "bg-indigo-50 dark:bg-indigo-900/30"
                      )}
                    >
                      <Text
                        className={clsx(
                          "text-sm font-semibold",
                          test.isLocked
                            ? "text-slate-400 dark:text-slate-500"
                            : "text-indigo-600 dark:text-indigo-400"
                        )}
                      >
                        {test.id}
                      </Text>
                    </View>
                    {test.isLocked && <Lock size={15} color="#9ca3af" />}
                  </View>

                  <Text className="text-slate-900 dark:text-white font-semibold text-sm mb-1">
                    Testi {test.id}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase">
                      2025
                    </Text>
                    <Text
                      className={clsx(
                        "text-[10px] font-semibold",
                        test.isLocked ? "text-amber-500" : "text-emerald-500"
                      )}
                    >
                      {test.isLocked ? "Premium" : "Falas"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
