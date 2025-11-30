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
  Dimensions,
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
import { Clock, X, ChevronRight, ChevronLeft } from "lucide-react-native";
import { clsx } from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TestRunner"
>;
type RouteProps = RouteProp<RootStackParamList, "TestRunner">;

// DESIGN TOKENS
const PRIMARY = "#4f46e5";
const BG_COLOR = "#F7F8FA";

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
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text className="mt-4 text-slate-400 font-medium">
          Duke ngarkuar pyetjet...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !questions || questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-slate-950 p-6">
        <Text className="mb-6 text-center text-slate-500 font-medium">
          {error ? "Gabim gjatë ngarkimit të testit" : "Nuk u gjetën pyetje për këtë test."}
        </Text>
        <Button 
          label="Kthehu mbrapa" 
          onPress={() => navigation.goBack()}
          className="bg-slate-900 dark:bg-white px-8"
          textClassName="text-white dark:text-slate-900"
        />
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = answers[currentQuestion.id] || [];
  const isTimeLow = timeLeft < 300; // last 5 mins
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="bg-white dark:bg-slate-900 px-5 py-3 flex-row items-center justify-between shadow-sm shadow-slate-100 dark:shadow-none border-b border-transparent dark:border-slate-800 z-10">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
          >
            <X size={20} color="#64748b" />
          </TouchableOpacity>

          {/* Timer */}
          <View className="flex-row items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
            <Clock size={14} color={isTimeLow ? "#ef4444" : "#94a3b8"} />
            <Text
              className={clsx(
                "font-mono text-sm font-bold tabular-nums",
                isTimeLow ? "text-red-500" : "text-slate-600 dark:text-slate-300"
              )}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>

          <View className="items-end">
             <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Pyetja</Text>
             <Text className="text-sm font-extrabold text-slate-900 dark:text-white">
                {currentQuestionIndex + 1}/{questions.length}
             </Text>
          </View>
        </View>

        {/* Progress Line */}
        <View className="h-1 w-full bg-slate-100 dark:bg-slate-800">
          <View
             className="h-full bg-indigo-600 rounded-r-full"
             style={{ width: `${progress}%` }}
          />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Card */}
          <View className="bg-white dark:bg-slate-900 p-1 rounded-3xl shadow-sm shadow-slate-200 dark:shadow-none mb-6 border border-slate-100 dark:border-slate-800">
             {currentQuestion.image_url && (
               <Image
                 source={{ uri: currentQuestion.image_url }}
                 className="h-56 w-full rounded-2xl bg-slate-50 dark:bg-slate-800 mb-4"
                 resizeMode="contain"
               />
             )}
             
             <View className="px-4 pb-4 pt-2">
               <View className="flex-row items-center mb-3 gap-2">
                  <View className="bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/30">
                    <Text className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                       4 Pikë
                    </Text>
                  </View>
                  {category && (
                    <View className="bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                      <Text className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Kategoria {category}
                      </Text>
                    </View>
                  )}
               </View>

               <Text className="text-lg font-bold text-slate-900 dark:text-white leading-7">
                 {currentQuestion.question_text}
               </Text>
             </View>
          </View>

          {/* Options */}
          <View className="gap-3">
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
                  onPress={() => handleAnswer(currentQuestion.id, option.id)}
                  activeOpacity={0.9}
                  className={clsx(
                    "flex-row items-center p-4 rounded-2xl border-2 transition-all",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20"
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                  )}
                >
                  <View
                    className={clsx(
                      "h-8 w-8 items-center justify-center rounded-full border mr-4",
                      isSelected
                        ? "bg-indigo-600 border-indigo-600"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    )}
                  >
                    <Text
                      className={clsx(
                        "text-xs font-bold",
                        isSelected ? "text-white" : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {option.id}
                    </Text>
                  </View>

                  <Text
                    className={clsx(
                      "flex-1 text-[15px] leading-6",
                      isSelected ? "text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-300 font-medium"
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
        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 px-6 pt-5 pb-8 border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none">
          <View className="flex-row items-center justify-between gap-4">
            <TouchableOpacity
              onPress={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestionIndex === 0}
              className={clsx(
                "h-12 w-12 items-center justify-center rounded-full border",
                currentQuestionIndex === 0
                  ? "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 active:bg-slate-50 dark:active:bg-slate-800"
              )}
            >
               <ChevronLeft size={24} color={currentQuestionIndex === 0 ? "#cbd5e1" : "#64748b"} />
            </TouchableOpacity>

            {currentQuestionIndex === questions.length - 1 ? (
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 h-12 rounded-full items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
              >
                 {isSubmitting ? (
                    <ActivityIndicator color="white" />
                 ) : (
                    <Text className="text-white font-bold text-base">Përfundo Testin</Text>
                 )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                className="flex-1 bg-slate-900 dark:bg-white h-12 rounded-full flex-row items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none active:scale-95"
              >
                 <Text className="text-white dark:text-slate-900 font-bold text-base mr-2">Vazhdo</Text>
                 <ChevronRight size={20} color={PRIMARY ? "white" : "black"} /> 
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

