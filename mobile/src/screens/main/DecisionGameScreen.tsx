import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { useScenarios, useCompleteCategory } from "@drivewise/core";
import { Button } from "../../components/ui/Button";
import { X, CheckCircle, XCircle, Clock, Play } from "lucide-react-native";
import { clsx } from "clsx";
import { useAuth } from "@/contexts/AuthContext";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DecisionGame"
>;
type RouteProps = RouteProp<RootStackParamList, "DecisionGame">;

const { width } = Dimensions.get("window");

type SessionAttempt = {
  scenarioId: string;
  isCorrect: boolean;
  selectedOptions: number[];
  timeTakenMs: number;
  xpEarned: number;
};

export const DecisionGameScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { category, scenarioId, topic } = route.params;
  const { user } = useAuth();

  // Fetch scenarios filtered by category and optionally topic
  // @ts-ignore
  const { data: allScenarios, isLoading } = useScenarios(category, topic);
  const completeCategoryMutation = useCompleteCategory();

  const [gameScenarios, setGameScenarios] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionAttempts, setSessionAttempts] = useState<SessionAttempt[]>([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<
    "playing" | "feedback" | "finished"
  >("playing");

  const currentScenario = gameScenarios[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game session with random 10 scenarios
  useEffect(() => {
    if (allScenarios && allScenarios.length > 0 && gameScenarios.length === 0) {
      if (scenarioId) {
        const found = allScenarios.find((s: any) => s.id === scenarioId);
        if (found) {
          setGameScenarios([found]);
        }
      } else {
        const shuffled = [...allScenarios].sort(() => 0.5 - Math.random());
        setGameScenarios(shuffled.slice(0, 10));
      }
    }
  }, [allScenarios, scenarioId]);

  // Reset timer and start time on new scenario
  useEffect(() => {
    if (gameState === "playing" && currentScenario) {
      setStartTime(Date.now());
      setTimeLeft(30);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, gameState, currentScenario]);

  // Stop timer when entering feedback or finished
  useEffect(() => {
    if (gameState !== "playing" && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [gameState]);

  const handleTimeUp = () => {
    handleSubmitAnswer(true);
  };

  const handleOptionSelect = (index: number) => {
    if (gameState !== "playing") return;

    setSelectedOptions((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSubmitAnswer = (autoSubmit = false) => {
    if (!currentScenario) return;
    if (!autoSubmit && selectedOptions.length === 0) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const correctOptionIndices = currentScenario.options
      .map((option: any, index: number) => (option.isCorrect ? index : -1))
      .filter((index: number) => index !== -1);

    const isAnswerCorrect =
      selectedOptions.length === correctOptionIndices.length &&
      selectedOptions.every((index: number) => correctOptionIndices.includes(index)) &&
      correctOptionIndices.every((index: number) => selectedOptions.includes(index));

    setIsCorrect(isAnswerCorrect);
    setGameState("feedback");

    const timeTaken = Math.max(Date.now() - startTime, (30 - timeLeft) * 1000);
    const xpEarned = isAnswerCorrect ? currentScenario.xp : 0;

    if (isAnswerCorrect) {
      setScore((s) => s + xpEarned);
    }

    const attempt: SessionAttempt = {
      scenarioId: currentScenario.id,
      isCorrect: isAnswerCorrect,
      selectedOptions,
      timeTakenMs: timeTaken,
      xpEarned,
    };

    setSessionAttempts((prev) => [...prev, attempt]);
  };

  const handleNext = () => {
    if (!gameScenarios) return;

    if (currentIndex < gameScenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptions([]);
      setIsCorrect(null);
      setGameState("playing");
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    setGameState("finished");
    if (user && sessionAttempts.length > 0) {
      const totalTimeMs = sessionAttempts.reduce((acc, curr) => acc + curr.timeTakenMs, 0);
      try {
        await completeCategoryMutation.mutateAsync({
          userId: user.id,
          category,
          attempts: sessionAttempts,
          totalTimeMs,
        });
      } catch (error) {
        console.error("Failed to save session:", error);
        Alert.alert("Gabim", "Nuk mundëm të ruajmë rezultatet tuaja. Provoni përsëri.");
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500">Duke përgatitur skenarët...</Text>
      </SafeAreaView>
    );
  }

  if (!allScenarios || allScenarios.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 p-6">
        <View className="items-center">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-slate-100 border border-slate-200">
            {/* @ts-ignore */}
            <XCircle size={48} color="#94a3b8" />
          </View>
          <Text className="mb-2 text-xl font-bold text-slate-900 text-center">
            Nuk u gjetën skenarë
          </Text>
          <Text className="mb-8 text-base text-slate-500 text-center">
            Nuk ka skenarë të disponueshëm për këtë kategori aktualisht.
          </Text>

          <Button
            label="Kthehu mbrapa"
            onPress={() => navigation.goBack()}
            className="w-full min-w-[200px] bg-[#1e1b4b]"
            textClassName="text-white font-bold"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentScenario || gameState === "finished") {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 p-6">
        <View className="items-center">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-yellow-100 border border-yellow-200">
            <Text className="text-4xl">🏆</Text>
          </View>
          <Text className="mb-2 text-3xl font-bold text-slate-900">
            Sesioni përfundoi!
          </Text>
          <Text className="mb-8 text-lg text-slate-500">
            Pikët e fituara:{" "}
            <Text className="font-semibold text-yellow-600">{score} XP</Text>
          </Text>

          <Button
            label="Kthehu në menu"
            onPress={() => navigation.goBack()}
            className="w-full min-w-[200px] bg-[#1e1b4b]"
            textClassName="text-white font-bold"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-slate-200"
        >
          {/* @ts-ignore */}
          <X size={20} color="#1e293b" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          {/* Timer Pill */}
          <View className={clsx(
            "flex-row items-center rounded-full border px-3 py-1.5",
            timeLeft <= 10 ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-100"
          )}>
            {/* @ts-ignore */}
            <Clock size={14} color={timeLeft <= 10 ? "#ef4444" : "#64748b"} />
            <Text className={clsx(
              "ml-1 text-xs font-bold tabular-nums",
              timeLeft <= 10 ? "text-red-600" : "text-slate-700"
            )}>
              {timeLeft}s
            </Text>
          </View>

          {/* XP pill */}
          <View className="flex-row items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5">
            <Text className="mr-1 text-xs font-bold text-yellow-700">
              {score}
            </Text>
            <Text className="text-[10px] font-semibold uppercase tracking-[0.16em] text-yellow-600">
              XP
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-1 w-full bg-slate-200">
        <View
          className="h-full bg-[#1e1b4b]"
          style={{
            width: `${((currentIndex + 1) / gameScenarios.length) * 100}%`,
          }}
        />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Scenario Image */}
        {currentScenario.image_url && (
          <View className="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <Image
              source={{ uri: currentScenario.image_url }}
              className="h-52 w-full rounded-xl"
              resizeMode="contain"
            />
          </View>
        )}

        {/* Question Text Card */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Skenari {currentIndex + 1}/{gameScenarios.length}
            </Text>
          </View>
          <Text className="text-xl font-bold leading-8 text-slate-900">
            {currentScenario.question}
          </Text>
        </View>

        {/* Options */}
        <View className="gap-3">
          {currentScenario.options.map((option: any, index: number) => {
            const isSelected = selectedOptions.includes(index);
            const isFeedbackMode = gameState === "feedback";

            let borderClass = "border-slate-200";
            let bgClass = "bg-white";
            let textClass = "text-slate-700 font-medium";
            let indexBgClass = "bg-slate-50 border-slate-200";
            let indexTextClass = "text-slate-500";
            let icon: React.ReactNode = null;

            if (isFeedbackMode) {
              if (option.isCorrect) {
                // Always highlight correct answer in feedback
                borderClass = "border-green-500";
                bgClass = "bg-green-50";
                textClass = "text-green-900 font-bold";
                indexBgClass = "bg-green-100 border-green-200";
                indexTextClass = "text-green-700";
                // @ts-ignore
                icon = <CheckCircle size={20} color="#16a34a" />;
              } else if (isSelected && !option.isCorrect) {
                // Highlight wrong selection
                borderClass = "border-red-500";
                bgClass = "bg-red-50";
                textClass = "text-red-900 font-bold";
                indexBgClass = "bg-red-100 border-red-200";
                indexTextClass = "text-red-700";
                // @ts-ignore
                icon = <XCircle size={20} color="#dc2626" />;
              }
            } else {
              if (isSelected) {
                borderClass = "border-[#1e1b4b]";
                bgClass = "bg-blue-50";
                textClass = "text-[#1e1b4b] font-bold";
                indexBgClass = "bg-[#1e1b4b] border-[#1e1b4b]";
                indexTextClass = "text-white";
              }
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionSelect(index)}
                disabled={isFeedbackMode}
                activeOpacity={0.7}
                className={clsx(
                  "flex-row items-center rounded-2xl border-2 px-4 py-4 shadow-sm transition-all active:scale-[0.99]",
                  borderClass,
                  bgClass
                )}
              >
                <View className={clsx(
                  "mr-3 h-8 w-8 items-center justify-center rounded-full border",
                  indexBgClass
                )}>
                  <Text className={clsx("text-xs font-bold", indexTextClass)}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>

                <Text className={clsx("flex-1 text-base leading-6", textClass)}>
                  {option.text}
                </Text>

                {icon && <View className="ml-3">{icon}</View>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Controls */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 pt-4 pb-10 shadow-lg">
        <View className="w-full">
          {gameState === "playing" ? (
            <Button
              label="Konfirmo"
              onPress={() => handleSubmitAnswer(false)}
              className={clsx(
                "w-full shadow-md",
                selectedOptions.length > 0 
                  ? "bg-[#1e1b4b] shadow-blue-200" 
                  : "bg-[#1e1b4b] shadow-none"
              )}
              disabled={selectedOptions.length === 0}
              textClassName="text-white font-bold"
            />
          ) : (
            <View>
              <View
                className={clsx(
                  "mb-4 rounded-2xl border px-4 py-4 shadow-sm",
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                )}
              >
                <View className="flex-row items-center mb-2 gap-3">
                  {/* @ts-ignore */}
                  {isCorrect ? <CheckCircle size={20} color="#15803d" /> : <XCircle size={20} color="#b91c1c" />}
                  <Text
                    className={clsx(
                      "text-base font-bold",
                      isCorrect ? "text-green-800" : "text-red-800"
                    )}
                  >
                    {isCorrect ? "Përgjigje e saktë!" : "Përgjigje e gabuar"}
                  </Text>
                </View>
                <Text className="text-sm leading-5 text-slate-700 ml-1">
                  {currentScenario.correct_explanation}
                </Text>
              </View>

              <Button
                label={currentIndex < (gameScenarios.length || 0) - 1 ? "Vazhdo" : "Përfundo"}
                onPress={handleNext}
                className="w-full bg-[#1e1b4b] shadow-md shadow-blue-200"
                textClassName="text-white font-bold"
                // @ts-ignore
                icon={<Play size={18} color="white" />}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
