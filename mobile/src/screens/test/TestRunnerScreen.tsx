import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  BackHandler,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import {
  useTestQuestions,
  useSubmitTestAttempt,
} from "@drivewise/core";
import { Button } from "../../components/ui/Button";
import { Clock, ChevronLeft, X } from "lucide-react-native";
import { clsx } from "clsx";
import { useAuth } from "../../contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TestRunner"
>;
type RouteProps = RouteProp<RootStackParamList, "TestRunner">;

export const TestRunnerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { testId, category } = route.params;
  const { user } = useAuth();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: questions,
    isLoading,
    error,
  } = useTestQuestions(category, testId, user?.id);
  const submitTest = useSubmitTestAttempt();

  // Timer effect
  useEffect(() => {
    if (!questions) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  // Back button handler
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Ndalo Testin",
        "Jeni i sigurt që dëshironi të dilni? Progresi juaj do të humbet.",
        [
          { text: "Jo", onPress: () => null, style: "cancel" },
          { text: "Po", onPress: () => navigation.goBack() },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigation]);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      if (currentAnswers.includes(optionId)) {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((id) => id !== optionId),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentAnswers, optionId],
        };
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmit = async () => {
    if (!questions) {
        return;
    }
    if (isSubmitting) {
        return;
    }
    if (!user) {
        Alert.alert("Gabim", "Ju duhet të jeni i kyçur për të dorëzuar testin.");
        return;
    }

    setIsSubmitting(true);
    try {
      let score = 0;
      const totalQuestions = questions.length;

      questions.forEach((q) => {
        const userAns = answers[q.id] || [];
        const correctAnswer = q.correct_answer;
        const isCorrect =
          userAns.includes(correctAnswer) && userAns.length === 1;
        if (isCorrect) score++;
      });

      const percentage = Math.round((score / totalQuestions) * 100);

      const answersPayload: any = {};
      Object.keys(answers).forEach((k) => {
        answersPayload[k] = answers[k][0]; // first selected answer
      });

      const result = await submitTest.mutateAsync({
        userId: user.id,
        category,
        testNumber: testId,
        questions,
        answers: answersPayload,
        score,
        percentage,
      });

      navigation.replace("TestResult", { attemptId: result.testAttempt.id });
    } catch (error: any) {
      console.error('Submit test error:', error);
      Alert.alert("Gabim", `Ndodhi një problem gjatë dërgimit të testit: ${error.message || 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#1e1b4b" />
        <Text className="mt-4 text-slate-500">
          Duke ngarkuar pyetjet...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 p-6">
        <Text className="mb-4 text-center text-red-500 font-medium">
          {error ? "Gabim gjatë ngarkimit të testit" : "Nuk u gjetën pyetje për këtë test."}
        </Text>
        <Button 
          label="Kthehu mbrapa" 
          onPress={() => navigation.goBack()}
          className="bg-[#1e1b4b]" 
        />
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = answers[currentQuestion.id] || [];
  const isTimeLow = timeLeft < 300; // last 5 mins

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-slate-200 px-4 py-3 bg-white">
          {/* Exit */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full bg-slate-100 p-2"
          >
            {/* @ts-ignore */}
            <X size={24} color="#1e293b" />
          </TouchableOpacity>

          {/* Timer pill */}
          <View
            className={clsx(
              "flex-row items-center rounded-full px-4 py-1.5 border",
              isTimeLow
                ? "bg-red-50 border-red-200"
                : "bg-slate-100 border-slate-200"
            )}
          >
            {/* @ts-ignore */}
            <Clock size={16} color={isTimeLow ? "#ef4444" : "#64748b"} />
            <Text
              className={clsx(
                "ml-2 font-mono text-base font-bold tabular-nums",
                isTimeLow
                  ? "text-red-500"
                  : "text-slate-700"
              )}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>

          {/* Progress label */}
          <View className="items-end">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pyetja
            </Text>
            <Text className="text-sm font-bold text-[#1e1b4b]">
              {currentQuestionIndex + 1} <Text className="text-slate-400">/</Text> {questions.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-1 w-full bg-slate-200">
          <View
            className="h-full bg-[#1e1b4b]"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Image */}
          {currentQuestion.image_url && (
            <View className="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <Image
                source={{ uri: currentQuestion.image_url }}
                className="h-52 w-full rounded-xl"
                resizeMode="contain"
              />
            </View>
          )}

          {/* Question Text Card */}
          <View className="mb-6">
            <Text className="mb-3 text-xl font-bold leading-8 text-slate-900">
              {currentQuestion.question_text}
            </Text>
            <View className="flex-row items-center">
              <View className="bg-blue-50 px-2 py-1 rounded border border-blue-100 mr-2">
                <Text className="text-xs font-bold text-blue-700">
                  4 Pikë
                </Text>
              </View>
              {category && (
                <View className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  <Text className="text-xs font-bold text-slate-600">
                    Kat. {category}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Options */}
          <View className="space-y-3">
            {[
              { id: "A", text: currentQuestion.option_a },
              { id: "B", text: currentQuestion.option_b },
              { id: "C", text: currentQuestion.option_c },
            ]
              .filter((option) => option.text && option.text.trim().length > 0)
              .map((option) => {
              const isSelected = currentAnswers.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() =>
                    handleAnswer(currentQuestion.id, option.id)
                  }
                  className={clsx(
                    "flex-row items-center rounded-2xl border-2 p-4 transition-all active:scale-[0.99]",
                    isSelected
                      ? "border-[#1e1b4b] bg-blue-50/50 shadow-sm"
                      : "border-slate-200 bg-white shadow-sm"
                  )}
                  activeOpacity={0.7}
                >
                  {/* Option badge */}
                  <View
                    className={clsx(
                      "mr-4 h-10 w-10 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-[#1e1b4b] bg-[#1e1b4b]"
                        : "border-slate-200 bg-slate-50"
                    )}
                  >
                    <Text
                      className={clsx(
                        "text-sm font-bold",
                        isSelected ? "text-white" : "text-slate-500"
                      )}
                    >
                      {option.id}
                    </Text>
                  </View>

                  {/* Option text */}
                  <Text
                    className={clsx(
                      "flex-1 text-base leading-6",
                      isSelected
                        ? "text-slate-900 font-bold"
                        : "text-slate-700 font-medium"
                    )}
                  >
                    {option.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Footer Controls */}
        <View className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-4 shadow-lg">
          <View className="flex-row items-center justify-between gap-4">
            <Button
              variant="ghost"
              label="Mbrapa"
              disabled={currentQuestionIndex === 0}
              onPress={() =>
                setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
              }
              className="flex-1 bg-slate-100 border border-slate-200"
              textClassName="text-slate-600 font-bold"
            />

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                variant="primary"
                label="Përfundo Testin"
                onPress={handleSubmit}
                loading={isSubmitting}
                className="flex-1 bg-green-600 shadow-md shadow-green-200"
                textClassName="text-white font-bold"
              />
            ) : (
              <Button
                variant="primary"
                label="Vazhdo"
                onPress={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(prev + 1, questions.length - 1)
                  )
                }
                className="flex-1 bg-[#1e1b4b] shadow-md shadow-blue-200"
                textClassName="text-white font-bold"
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

