import React from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { Button } from "../../components/ui/Button";
import { CheckCircle2, XCircle, AlertCircle, RotateCw, ArrowRight } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { clsx } from "clsx";
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TestResult"
>;
type RouteProps = RouteProp<RootStackParamList, "TestResult">;

// DESIGN TOKENS
const PRIMARY = "#4f46e5";
const BG_COLOR = "#F7F8FA";

type TestAttempt = {
  id: string;
  percentage: number;
  score: number;
  total_questions: number;
  category: string;
  test_set_id?: string | null;
  created_at?: string;
  answers?: any[];
};

export const TestResultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { attemptId } = route.params;

  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState<number | null>(0);

  const {
    data: attempt,
    isLoading,
    isError,
  } = useQuery<TestAttempt>({
    queryKey: ["test-attempt", attemptId],
    queryFn: async () => {
      // 1. Fetch Attempt
      const { data: attemptData, error: attemptError } = await supabase
        .from("test_attempts")
        .select("*")
        .eq("id", attemptId)
        .single();

      if (attemptError) throw attemptError;

      // 2. Fetch Answers
      const { data: answersData, error: answersError } = await supabase
        .from("test_attempt_answers")
        .select("*")
        .eq("test_attempt_id", attemptId);

      if (answersError) throw answersError;

      if (!answersData || answersData.length === 0) {
        return { ...(attemptData as any), answers: [] } as TestAttempt;
      }

      // 3. Fetch Questions
      const questionIds = answersData.map((a: any) => a.question_id);
      const { data: questionsData, error: questionsError } = await supabase
        .from("admin_questions")
        .select("*")
        .in("id", questionIds);

      if (questionsError) throw questionsError;

      // 4. Merge
      const questionsMap = new Map(questionsData?.map((q: any) => [q.id, q]));
      const mergedAnswers = answersData.map((ans: any) => ({
        ...ans,
        question: questionsMap.get(ans.question_id),
      }));

      return { ...(attemptData as any), answers: mergedAnswers } as TestAttempt;
    },
  });

  if (isLoading || !attempt) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text className="mt-4 text-sm text-slate-500 font-medium">
          Duke llogaritur rezultatet...
        </Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-6">
        <View className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <View className="flex-row items-center gap-2">
            {/* @ts-ignore */}
            <AlertCircle size={18} color="#EF4444" />
            <Text className="text-sm font-semibold text-red-600">
              Gabim gjatë ngarkimit të rezultatit
            </Text>
          </View>
        </View>
        <Button
          label="Kthehu mbrapa"
          onPress={() => navigation.goBack()}
          className="w-full bg-white border border-slate-200"
          textClassName="text-slate-700"
        />
      </SafeAreaView>
    );
  }

  const isPassed = attempt.percentage >= 85;
  const answers = attempt.answers || [];

  return (
    <View className="flex-1 bg-[#F7F8FA]">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 24,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-center w-full mt-4">
            {/* Result Icon */}
            <View
              className={clsx(
                "mb-6 h-24 w-24 items-center justify-center rounded-full shadow-lg shadow-slate-200",
                isPassed
                  ? "bg-green-500 shadow-green-200"
                  : "bg-red-500 shadow-red-200"
              )}
            >
              {isPassed ? (
                // @ts-ignore
                <CheckCircle2 size={48} color="white" />
              ) : (
                // @ts-ignore
                <XCircle size={48} color="white" />
              )}
            </View>

            {/* Title & subtitle */}
            <Text className="mb-2 text-3xl font-extrabold text-slate-900 text-center">
              {isPassed ? "Urime, Kaluat!" : "Nuk e kaluat"}
            </Text>
            <Text className="mb-8 max-w-xs text-center text-sm text-slate-500 leading-5">
              {isPassed
                ? "Keni arritur rezultatin e kërkuar. Vazhdoni kështu!"
                : "Mos u dorëzoni. Rishikoni gabimet dhe provoni përsëri."}
            </Text>

            {/* Score Card */}
            <View className="mb-10 w-full rounded-[32px] bg-white p-8 shadow-sm shadow-slate-200 border border-slate-100">
              {/* Percentage */}
              <View className="items-center">
                <Text className={clsx(
                   "mb-1 text-6xl font-black tracking-tighter",
                   isPassed ? "text-green-500" : "text-red-500"
                )}>
                  {attempt.percentage}%
                </Text>
                <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Saktësia Totale
                </Text>
              </View>

              {/* Divider */}
              <View className="h-px w-full bg-slate-100 my-6" />

              {/* Details */}
              <View className="flex-row justify-between">
                 <View className="items-center flex-1">
                    <Text className="text-2xl font-bold text-slate-900">{attempt.score}</Text>
                    <Text className="text-xs text-slate-400 font-semibold">Të Sakta</Text>
                 </View>
                 <View className="w-px bg-slate-100 h-full mx-4" />
                 <View className="items-center flex-1">
                    <Text className="text-2xl font-bold text-slate-900">{attempt.total_questions}</Text>
                    <Text className="text-xs text-slate-400 font-semibold">Pyetje</Text>
                 </View>
                 <View className="w-px bg-slate-100 h-full mx-4" />
                 <View className="items-center flex-1">
                    <Text className="text-2xl font-bold text-slate-900">{attempt.category}</Text>
                    <Text className="text-xs text-slate-400 font-semibold">Kategoria</Text>
                 </View>
              </View>
            </View>
          </View>

          {/* Question Review */}
          <View className="w-full mb-8">
            <View className="flex-row items-center justify-between mb-4 px-1">
               <Text className="text-lg font-bold text-slate-900">Rishikimi</Text>
               <Text className="text-xs font-semibold text-slate-400">Prek numrin për detaje</Text>
            </View>
            
            {/* Grid of Numbers */}
            <View className="flex-row flex-wrap gap-2.5 mb-6">
              {answers.map((ans: any, index: number) => {
                const isSelected = selectedQuestionIndex === index;
                return (
                  <TouchableOpacity
                    key={ans.id}
                    onPress={() => setSelectedQuestionIndex(index)}
                    className={clsx(
                      "w-[13.5%] aspect-square items-center justify-center rounded-xl border transition-all",
                      isSelected 
                        ? (ans.is_correct ? "border-green-500 bg-green-500" : "border-red-500 bg-red-500")
                        : (ans.is_correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")
                    )}
                  >
                    <Text className={clsx(
                      "font-bold text-sm", 
                      isSelected ? "text-white" : (ans.is_correct ? "text-green-700" : "text-red-700")
                    )}>
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Question Detail */}
            {selectedQuestionIndex !== null && answers[selectedQuestionIndex] && (
              (() => {
                const ans = answers[selectedQuestionIndex];
                return (
                  <View className="border border-slate-200 rounded-3xl p-5 bg-white shadow-sm">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="bg-slate-100 px-3 py-1 rounded-lg">
                           <Text className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Pyetja {selectedQuestionIndex + 1}</Text>
                        </View>
                        {ans.is_correct ? (
                            <View className="flex-row items-center">
                                <CheckCircle2 size={16} color="#15803d" />
                                <Text className="text-green-700 text-xs font-bold ml-1.5 uppercase">Saktë</Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center">
                                <XCircle size={16} color="#b91c1c" />
                                <Text className="text-red-700 text-xs font-bold ml-1.5 uppercase">Gabim</Text>
                            </View>
                        )}
                    </View>

                    <Text className="text-slate-900 font-bold text-lg mb-4 leading-7">
                      {ans.question?.question_text || "Pyetje e panjohur"}
                    </Text>
                    
                    {ans.question?.image_url && (
                        <View className="mb-5 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                          <Image 
                            source={{ uri: ans.question.image_url }} 
                            className="w-full h-48"
                            resizeMode="contain"
                          />
                        </View>
                    )}

                    <View className="space-y-3">
                        {/* User Answer (if wrong) */}
                        {!ans.is_correct && (
                            <View className="bg-red-50 p-4 rounded-2xl border border-red-100">
                                <Text className="text-[10px] text-red-500 font-bold mb-1 uppercase tracking-wider">Zgjedhja juaj</Text>
                                <Text className="text-red-900 font-medium">
                                  {ans.question?.[`option_${ans.selected_answer.toLowerCase()}`] || ans.selected_answer}
                                </Text>
                            </View>
                        )}
                        
                        {/* Correct Answer */}
                        <View className="bg-green-50 p-4 rounded-2xl border border-green-100">
                            <Text className="text-[10px] text-green-600 font-bold mb-1 uppercase tracking-wider">Përgjigja e saktë</Text>
                            <Text className="text-green-900 font-medium">
                              {ans.question?.[`option_${ans.question?.correct_answer.toLowerCase()}`] || ans.question?.correct_answer}
                            </Text>
                        </View>
                    </View>
                  </View>
                );
              })()
            )}
          </View>

          {/* Actions */}
          <View className="mt-2 w-full gap-3">
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => {
                if (attempt.test_set_id) {
                  navigation.navigate("TestRunner", {
                    testId: attempt.test_set_id,
                    category: attempt.category,
                  });
                } else {
                  navigation.navigate("TestRunner", {
                    testId: "random",
                    category: attempt.category,
                  });
                }
              }}
              className="w-full bg-indigo-600 rounded-full py-4 flex-row items-center justify-center shadow-lg shadow-indigo-200"
            >
              <RotateCw size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-base">{isPassed ? "Riprovo Testin" : "Provo Përsëri"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("App", {
                  screen: "Testet",
                })
              }
              className="w-full bg-white border border-slate-200 rounded-full py-4 flex-row items-center justify-center"
            >
              <Text className="text-slate-700 font-bold text-base mr-2">Kthehu te Testet</Text>
              <ArrowRight size={20} color="#334155" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
