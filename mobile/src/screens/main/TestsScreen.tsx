import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCategory } from "../../contexts/CategoryContext";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboardStats, useTestCount, useUserPlans, useGlobalDailyStreak } from "@drivewise/core";
import { Lock, Zap, Activity, PlayCircle, CheckCircle2, BookOpen, BrainCircuit, FileText, LogIn, ChevronRight } from "lucide-react-native";
import { clsx } from "clsx";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { DashboardSkeleton } from "../../components/skeletons/DashboardSkeleton";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "App">;

// DESIGN TOKENS
const PRIMARY = "#4f46e5";
const BG_COLOR = "#F7F8FA";

export const TestsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { selectedCategory, setCategory } = useCategory();
  const { user, profile } = useAuth();

  const { data: stats, isLoading: statsLoading } = useDashboardStats(user?.id);
  const { data: globalStreak } = useGlobalDailyStreak(user?.id);
  const { data: testCount } = useTestCount(selectedCategory || "B");
  const { data: plans } = useUserPlans(user?.id);

  const isGuest = !user;

  const hasCategoryAccess = useMemo(() => {
    if (profile?.is_admin) return true;
    return (plans || []).some(
      (p) => p.category === (selectedCategory || "B") && p.status === "active"
    );
  }, [plans, selectedCategory, profile]);

  const validTestCount = testCount && testCount > 0 ? testCount : 30;

  const tests = useMemo(
    () =>
      Array.from({ length: validTestCount }).map((_, i) => {
        const testNum = i + 1;
        const isLocked = !hasCategoryAccess && testNum > 1;
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

  // ---------- SUBCOMPONENTS ----------

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

      <View className="flex-row justify-between mt-8">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Literatura" as any)}
          className="items-center w-1/3"
        >
          <View className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700 mb-2">
            <BookOpen size={20} color={PRIMARY} />
          </View>
          <Text className="text-xs font-semibold text-slate-900 dark:text-white">Literatura</Text>
          <Text className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 text-center">Baza e rregullave</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Trajneri" as any)}
          className="items-center w-1/3"
        >
          <View className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700 mb-2">
            <BrainCircuit size={20} color={PRIMARY} />
          </View>
          <Text className="text-xs font-semibold text-slate-900 dark:text-white">Trajneri</Text>
          <Text className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 text-center">Ushtroni temat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Testet" as any)}
          className="items-center w-1/3"
        >
          <View className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700 mb-2">
            <FileText size={20} color={PRIMARY} />
          </View>
          <Text className="text-xs font-semibold text-slate-900 dark:text-white">Testet</Text>
          <Text className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 text-center">Simuloni provimin</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.getParent()?.navigate("Login")}
        className="mt-8 bg-slate-900 dark:bg-indigo-600 py-4 rounded-full flex-row items-center justify-center shadow-sm shadow-slate-200 dark:shadow-none"
      >
        <LogIn size={18} color="white" />
        <Text className="text-white font-bold text-sm ml-2">Hyni për të ruajtur progresin</Text>
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

      {/* Clean stat chips */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 items-center">
          <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Mesatarja</Text>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardStats.averageScore}%</Text>
          <CheckCircle2 size={18} color={PRIMARY} className="mt-1"/>
        </View>
        <View className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 items-center">
          <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Testet</Text>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardStats.totalTests}</Text>
          <FileText size={18} color="#0ea5e9" className="mt-1"/>
        </View>
        <View className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 items-center">
          <Text className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Seria</Text>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{globalStreak?.currentStreak || 0}</Text>
          <Zap size={18} color="#f97316" className="mt-1"/>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F7F8FA] dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          {isGuest ? <GuestHeader /> : <LoggedInHeader />}

          {/* Quick actions */}
          <View className="px-6 mt-8">
            <Text className="text-base font-semibold text-slate-900 dark:text-white mb-3">Fillo testim</Text>

            {/* Random test */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (!hasCategoryAccess) navigation.getParent()?.navigate("Subscription");
                else navigation.getParent()?.navigate("TestInstructions", { testId: "random", category: selectedCategory! });
              }}
              className="mb-3"
            >
              <LinearGradient
                colors={[PRIMARY, "#6366f1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full rounded-3xl py-4 px-6 flex-row items-center justify-between"
              >
                <View>
                  <Text className="text-indigo-100 text-[11px] font-semibold uppercase tracking-wider">Rekomanduar</Text>
                  <Text className="text-white font-semibold text-lg mt-1">Test i rastit</Text>
                  <Text className="text-indigo-100 text-xs mt-1">30 pyetje të përzgjedhura automatikisht.</Text>
                </View>
                <View className="h-11 w-11 bg-white rounded-full items-center justify-center">
                  <PlayCircle size={26} color={PRIMARY} />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Personalized test */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (!hasCategoryAccess) navigation.getParent()?.navigate("Subscription");
                else navigation.getParent()?.navigate("TestInstructions", { testId: "personalized", category: selectedCategory! });
              }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl py-4 px-6 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Test i personalizuar</Text>
                <Text className="text-slate-900 dark:text-white font-semibold text-lg mt-1">Fokus te pikat e dobëta</Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1">Gjenerohet nga gabimet dhe rezultatet tuaja.</Text>
              </View>
              <View className="h-11 w-11 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center border border-slate-200 dark:border-slate-700">
                <Activity size={22} color={PRIMARY} />
              </View>
            </TouchableOpacity>
          </View>

          {/* All tests grid */}
          <View className="px-6 mt-10 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-slate-900 dark:text-white">Të gjitha testet</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCategory(null)}
                className="bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 flex-row items-center"
              >
                <Text className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mr-1">Kategoria {selectedCategory}</Text>
                <ChevronRight size={12} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-4">
              {tests.map((test) => (
                <TouchableOpacity
                  key={test.id}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (test.isLocked) navigation.getParent()?.navigate("Subscription");
                    else navigation.getParent()?.navigate("TestInstructions", { testId: test.id, category: selectedCategory! });
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
                          test.isLocked ? "text-slate-400 dark:text-slate-500" : "text-indigo-600 dark:text-indigo-400"
                        )}
                      >
                        {test.id}
                      </Text>
                    </View>
                    {test.isLocked && <Lock size={15} color="#9ca3af" />}
                  </View>

                  <Text className="text-slate-900 dark:text-white font-semibold text-sm mb-1">Testi {test.id}</Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase">2025</Text>
                    <Text className={clsx("text-[10px] font-semibold", test.isLocked ? "text-amber-500" : "text-emerald-500")}>
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
