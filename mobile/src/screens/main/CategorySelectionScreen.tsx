import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { clsx } from "clsx";
import {
  Car,
  Bike,
  Truck,
  Bus,
  ChevronRight,
  Info,
  CheckCircle2,
} from "lucide-react-native";

import { useCategory } from "../../contexts/CategoryContext";

const PRIMARY = "#4f46e5";
const BG = "#F7F8FA";

const CATEGORIES = [
  {
    id: "A",
    subtitle: "Motoçikleta",
    description:
      "A1: Motoçikletat e lehta që nuk kalon 125cm3.\nA: Motoçikleta deri 25 kw.",
    icon: Bike,
    colors: ["#FF6B6B", "#EE5D5D"],
    accent: "#FFE5E5",
    iconColor: "#D93025",
  },
  {
    id: "B",
    subtitle: "Vetura",
    description:
      "Mjetet motorike që nuk tejkalojnë masën 3500kg, me 8 ulëse.",
    icon: Car,
    colors: ["#4FACFE", "#00F2FE"],
    accent: "#E0F7FA",
    iconColor: "#0288D1",
  },
  {
    id: "C1",
    subtitle: "Kamionë të Lehtë",
    description: "Mjetet motorike prej 3500kg deri 7500kg.",
    icon: Truck,
    colors: ["#43E97B", "#38F9D7"],
    accent: "#E8F5E9",
    iconColor: "#2E7D32",
  },
  {
    id: "C",
    subtitle: "Kamionë të Rëndë",
    description: "Mjetet motorike me mbi 7500 kg.",
    icon: Truck,
    colors: ["#a855f7", "#d8b4fe"],
    accent: "#F3E5F5",
    iconColor: "#7B1FA2",
  },
  {
    id: "D",
    subtitle: "Autobusë",
    description:
      "Mjetet motorike për transportin e personave me më shumë se 8 ulëse.",
    icon: Bus,
    colors: ["#F59E0B", "#D97706"],
    accent: "#FEF3C7",
    iconColor: "#B45309",
  },
];

export const CategorySelectionScreen = () => {
  const { selectedCategory, setCategory } = useCategory();

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}
        >
          {/* HEADER */}
          <Animated.View
            entering={FadeIn.duration(400)}
            className="px-6 pt-10 pb-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 rounded-b-[40px] mb-8"
          >
            <Text className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              Mirësevini në DriveWise
            </Text>

            <Text className="text-[32px] font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
              Zgjidhni{" "}
              <Text style={{ color: PRIMARY }} className="font-extrabold">
                Kategorinë
              </Text>
            </Text>
          </Animated.View>

          {/* CATEGORY CARDS */}
          <View className="px-6 gap-6">
            {CATEGORIES.map((cat, index) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <Animated.View
                  key={cat.id}
                  entering={FadeInDown.delay(index * 90).springify()}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setCategory(cat.id)}
                    className={clsx(
                      "rounded-3xl overflow-hidden transition-all duration-200 border",
                      "shadow-sm dark:shadow-none",
                      isSelected
                        ? "border-indigo-600 shadow-md shadow-indigo-100/60 dark:border-indigo-500"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    )}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={[PRIMARY, "#6366f1"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-1.5 w-full"
                      />
                    )}

                    <View
                      className={clsx(
                        "p-6 flex-row items-start",
                        isSelected
                          ? "bg-indigo-50/40 dark:bg-indigo-900/20"
                          : "bg-white dark:bg-slate-900"
                      )}
                    >
                      {/* TEXT SECTION */}
                      <View className="flex-1 pr-4">
                        <View className="flex-row items-center mb-2">
                          <View
                            className={clsx(
                              "px-3 py-1 rounded-xl mr-2",
                              isSelected
                                ? "bg-indigo-100 dark:bg-indigo-900/30"
                                : "bg-slate-100 dark:bg-slate-800"
                            )}
                          >
                            <Text
                              className={clsx(
                                "text-xs font-extrabold",
                                isSelected
                                  ? "text-indigo-700 dark:text-indigo-400"
                                  : "text-slate-600 dark:text-slate-400"
                              )}
                            >
                              {cat.id}
                            </Text>
                          </View>

                          <Text className="text-[18px] font-semibold text-slate-900 dark:text-white">
                            {cat.subtitle}
                          </Text>
                        </View>

                        <Text className="text-slate-500 dark:text-slate-400 text-[13px] leading-5 mb-4">
                          {cat.description}
                        </Text>

                        <View className="flex-row items-center">
                          {isSelected ? (
                            <View className="flex-row items-center">
                              <CheckCircle2 size={18} color={PRIMARY} />
                              <Text
                                style={{ color: PRIMARY }}
                                className="ml-1 text-[14px] font-bold"
                              >
                                E Zgjedhur
                              </Text>
                            </View>
                          ) : (
                            <View className="flex-row items-center">
                              <Text className="text-[14px] font-semibold text-slate-400 dark:text-slate-500 mr-1">
                                Zgjidh
                              </Text>
                              <ChevronRight size={16} color="#94a3b8" />
                            </View>
                          )}
                        </View>
                      </View>

                      {/* ICON */}
                      <View className="justify-center">
                        <View
                          style={{
                            backgroundColor: isSelected
                              ? "#e0e7ff"
                              : cat.accent,
                          }}
                          className="h-[64px] w-[64px] rounded-2xl items-center justify-center"
                        >
                          {/* @ts-ignore - Dynamic icon component */}
                          <cat.icon
                            size={32}
                            color={isSelected ? PRIMARY : cat.iconColor}
                            strokeWidth={1.6}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}

            {/* INFO BOX */}
            <View className="mt-2 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex-row">
              <Info size={20} color="#64748b" />
              <Text className="ml-3 text-slate-500 dark:text-slate-400 text-[13px] leading-5 flex-1">
                Kategoritë përcaktojnë llojin e pyetjeve dhe simulimeve që do
                të shihni. Mund ta ndryshoni kategorinë në çdo kohë.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
