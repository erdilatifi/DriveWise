import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { Button } from "../../components/ui/Button";
import { useTheme } from "../../theme";
import {
  FileText,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  X,
  Icon as LucideIcon,
} from "lucide-react-native";
import { clsx } from "clsx";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TestInstructions"
>;
type RouteProps = RouteProp<RootStackParamList, "TestInstructions">;

type InstructionItem = {
  icon: React.ElementType;
  title: string;
  description: string;
  tint: string;
  bgClass: string;
};

export const TestInstructionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { testId, category } = route.params;
  const { isDark } = useTheme();

  // Dynamic icon color for dark mode visibility
  const iconColor = isDark ? "#818cf8" : "#1e1b4b"; // indigo-400 for dark, indigo-950 for light
  const iconColorAlt = isDark ? "#60a5fa" : "#3b82f6"; // blue-400 for dark, blue-500 for light

  const instructions: InstructionItem[] = [
    {
      icon: FileText,
      title: "Përmbajtja",
      description: "30 pyetje në total nga kategoria e zgjedhur.",
      tint: iconColor,
      bgClass: "bg-blue-50",
    },
    {
      icon: HelpCircle,
      title: "Pyetjet",
      description:
        "Pyetje me 1-2 përgjigje të sakta. Zgjidhni të gjitha opsionet e sakta.",
      tint: iconColorAlt,
      bgClass: "bg-blue-50",
    },
    {
      icon: CheckCircle2,
      title: "Kalueshmëria",
      description: "Duhet të arrish 85% të pikëve për të kaluar testin.",
      tint: iconColor,
      bgClass: "bg-blue-50",
    },
    {
      icon: Clock,
      title: "Kohëzgjatja",
      description: "Keni 45 minuta kohë për të përfunduar testin.",
      tint: iconColorAlt,
      bgClass: "bg-blue-50",
    },
  ];

  const testLabel =
    testId === "random" ? "testin e rastit" : `testin ${testId}`;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950 pt-5">
      <SafeAreaView className="flex-1 ">
        {/* Header */}
        <View className="relative px-8 pt-5 pb-3 flex-row items-center justify-center">
          <Button
            variant="ghost"
            className="absolute left-6 z-10 flex-row items-center gap-1.5 px-1 -ml-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={16} color={isDark ? "#94a3b8" : "#64748b"} />
          </Button>

          <View>
            <Text className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 tracking-[0.15em]">
              Testimi
            </Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero section */}
          <View className="mb-8 items-center mt-4">
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-blue-50 dark:bg-indigo-900/30 border-2 border-blue-100 dark:border-indigo-800">
              {/* @ts-ignore */}
              <FileText size={48} color={iconColor} />
            </View>

            <Text className="mb-1 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#3b82f6] dark:text-indigo-400">
              Udhëzime
            </Text>

            <Text className="mb-2 text-center text-3xl font-bold text-slate-900 dark:text-white">
              Para se të fillosh testin
            </Text>

            <Text className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
              Ju lutemi lexoni me kujdes udhëzimet më poshtë para se të filloni{" "}
              {testLabel} në kategorinë <Text className="font-bold text-[#1e1b4b] dark:text-indigo-400">{category}</Text>.
            </Text>
          </View>

          {/* Instruction cards */}
          <View className="gap-4">
            {instructions.map((item, index) => {
              const IconComp = item.icon as React.ElementType;
              return (
                <View
                  key={index}
                  className="flex-row items-start gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
                >
                  <View
                    className={clsx(
                      "h-12 w-12 items-center justify-center rounded-xl",
                      item.bgClass,
                      "dark:bg-slate-800"
                    )}
                  >
                    <IconComp size={24} color={item.tint} />
                  </View>

                  <View className="flex-1">
                    <Text className="mb-1 text-base font-bold text-slate-800 dark:text-white">
                      {item.title}
                    </Text>
                    <Text className="text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Tip / note */}
          <View className="mt-6 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20 p-5">
            <Text className="mb-1 text-sm font-bold text-[#1e1b4b] dark:text-indigo-400">
              Këshillë
            </Text>
            <Text className="text-xs leading-5 text-slate-600 dark:text-slate-400">
              Mos u nxitoni. Lexoni me kujdes çdo pyetje dhe të gjitha opcionet
              para se të përgjigj eni. Mund të ktheheni te pyetjet derisa koha të
              përfundojë.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom action */}
        <View className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <TouchableOpacity 
            onPress={() => navigation.replace("TestRunner", { testId, category })}
            className="w-full bg-[#1e1b4b] dark:bg-indigo-600 rounded-full py-4 items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-none active:scale-95"
          >
            <Text className="text-white font-bold text-lg italic tracking-wide">Fillo Testin</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};


