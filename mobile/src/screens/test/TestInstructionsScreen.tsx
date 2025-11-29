import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { Button } from "../../components/ui/Button";
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
import { LinearGradient } from "expo-linear-gradient";

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

  const instructions: InstructionItem[] = [
    {
      icon: FileText,
      title: "Përmbajtja",
      description: "30 pyetje në total nga kategoria e zgjedhur.",
      tint: "#1e1b4b",
      bgClass: "bg-blue-50",
    },
    {
      icon: HelpCircle,
      title: "Pyetjet",
      description:
        "Pyetje me 1-2 përgjigje të sakta. Zgjidhni të gjitha opsionet e sakta.",
      tint: "#3b82f6",
      bgClass: "bg-blue-50",
    },
    {
      icon: CheckCircle2,
      title: "Kalueshmëria",
      description: "Duhet të arrish 85% të pikëve për të kaluar testin.",
      tint: "#1e1b4b",
      bgClass: "bg-blue-50",
    },
    {
      icon: Clock,
      title: "Kohëzgjatja",
      description: "Keni 45 minuta kohë për të përfunduar testin.",
      tint: "#3b82f6",
      bgClass: "bg-blue-50",
    },
  ];

  const testLabel =
    testId === "random" ? "testin e rastit" : `testin ${testId}`;

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-2 pb-3 flex-row items-center justify-between">
          <Button
            variant="ghost"
            className="flex-row items-center gap-2 px-2 -ml-2 bg-white border border-slate-200 rounded-full"
            onPress={() => navigation.goBack()}
          >
            {/* @ts-ignore */}
            <ArrowLeft size={20} color="#334155" />
            <Text className="text-sm font-medium text-slate-700">Mbrapa</Text>
          </Button>

          <View>
            <Text className="text-xs font-semibold uppercase text-slate-400 tracking-[0.15em]">
              Testimi
            </Text>
          </View>

          {/* spacer to balance layout */}
          <View style={{ width: 80 }} />
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero section */}
          <View className="mb-8 items-center mt-4">
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-blue-50 border-2 border-blue-100">
              {/* @ts-ignore */}
              <FileText size={48} color="#1e1b4b" />
            </View>

            <Text className="mb-1 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#3b82f6]">
              Udhëzime
            </Text>

            <Text className="mb-2 text-center text-3xl font-bold text-slate-900">
              Para se të fillosh testin
            </Text>

            <Text className="text-center text-sm leading-6 text-slate-500">
              Ju lutemi lexoni me kujdes udhëzimet më poshtë para se të filloni{" "}
              {testLabel} në kategorinë <Text className="font-bold text-[#1e1b4b]">{category}</Text>.
            </Text>
          </View>

          {/* Instruction cards */}
          <View className="space-y-4">
            {instructions.map((item, index) => {
              const IconComp = item.icon as React.ElementType;
              return (
                <View
                  key={index}
                  className="flex-row items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <View
                    className={clsx(
                      "h-12 w-12 items-center justify-center rounded-xl",
                      item.bgClass
                    )}
                  >
                    <IconComp size={24} color={item.tint} />
                  </View>

                  <View className="flex-1">
                    <Text className="mb-1 text-base font-bold text-slate-800">
                      {item.title}
                    </Text>
                    <Text className="text-sm leading-5 text-slate-500">
                      {item.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Tip / note */}
          <View className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-5">
            <Text className="mb-1 text-sm font-bold text-[#1e1b4b]">
              Këshillë
            </Text>
            <Text className="text-xs leading-5 text-slate-600">
              Mos u nxitoni. Lexoni me kujdes çdo pyetje dhe të gjitha opcionet
              para se të përgjigjeni. Mund të ktheheni te pyetjet derisa koha të
              përfundojë.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom action */}
        <View className="border-t border-slate-200 bg-white p-6">
          <TouchableOpacity onPress={() => navigation.replace("TestRunner", { testId, category })}>
            <LinearGradient
              colors={['#1e1b4b', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full rounded-full py-4 items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <Text className="text-white font-bold text-lg italic tracking-wide">Fillo Testin</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
