import React from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { Button } from "../../components/ui/Button";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { clsx } from "clsx";
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TestResult"
>;
type RouteProps = RouteProp<RootStackParamList, "TestResult">;

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
        <ActivityIndicator size="large" color="#1e1b4b" />
        <Text className="mt-4 text-sm text-slate-500">
          Duke ngarkuar rezultatet...
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
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{
            padding: 24,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-center w-full">
            {/* Result Icon */}
            <View
              className={clsx(
                "mb-6 h-32 w-32 items-center justify-center rounded-full border-[6px]",
                isPassed
                  ? "border-green-100 bg-green-50"
                  : "border-red-100 bg-red-50"
              )}
            >
              {isPassed ? (
                // @ts-ignore
                <CheckCircle2 size={72} color="#22C55E" />
              ) : (
                // @ts-ignore
                <XCircle size={72} color="#EF4444" />
              )}
            </View>

            {/* Title & subtitle */}
            <Text className="mb-1 text-3xl font-extrabold text-slate-900 text-center">
              {isPassed ? "Urime! Kaluat testin" : "Nuk e kaluat këtë herë"}
            </Text>
            <Text className="mb-6 max-w-xs text-center text-sm text-slate-500">
              {isPassed
                ? "Keni arritur rezultatin e kërkuar për të kaluar testin. Vazhdoni me ushtrimet e tjera për të ruajtur nivelin!"
                : "Nuk keni arritur pikët e mjaftueshme këtë herë. Analizoni pyetjet dhe provoni përsëri për një rezultat më të mirë."}
            </Text>

            {/* Score Card */}
            <View className="mb-8 w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {/* Percentage */}
              <View className="items-center">
                <Text className="mb-1 text-5xl font-extrabold text-[#1e1b4b]">
                  {attempt.percentage}%
                </Text>
                <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Rezultati i përgjithshëm
                </Text>
              </View>

              {/* Correct / total */}
              <View className="mt-6 flex-row items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <View>
                  <Text className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Pyetjet e sakta
                  </Text>
                  <Text className="text-lg font-semibold text-slate-900">
                    {attempt.score} / {attempt.total_questions}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Kategoria
                  </Text>
                  <Text className="text-sm font-medium text-slate-900">
                    {attempt.category}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="mt-6">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Progresi
                  </Text>
                  <Text className="text-xs font-medium text-slate-600">
                    {attempt.percentage}% / 85% për të kaluar
                  </Text>
                </View>

                <View className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <View
                    className={clsx(
                      "h-full rounded-full",
                      isPassed ? "bg-green-500" : "bg-red-500"
                    )}
                    style={{ width: `${attempt.percentage}%` }}
                  />
                  {/* Pass mark indicator */}
                  <View
                    className="absolute top-0 bottom-0 w-[2px] bg-slate-300"
                    style={{ left: "85%" }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Question Review */}
          <View className="w-full mb-8">
            <Text className="text-lg font-bold text-slate-900 mb-4">Rishikimi i Pyetjeve</Text>
            
            {/* Grid of Numbers */}
            <View className="flex-row flex-wrap gap-2 mb-6 justify-center">
              {answers.map((ans: any, index: number) => {
                const isSelected = selectedQuestionIndex === index;
                return (
                  <TouchableOpacity
                    key={ans.id}
                    onPress={() => setSelectedQuestionIndex(index)}
                    className={clsx(
                      "w-10 h-10 items-center justify-center rounded-xl border-2",
                      isSelected 
                        ? (ans.is_correct ? "border-green-600 bg-green-100" : "border-red-600 bg-red-100")
                        : (ans.is_correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")
                    )}
                  >
                    <Text className={clsx(
                      "font-bold", 
                      ans.is_correct ? "text-green-700" : "text-red-700"
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
                    <View className="flex-row justify-between items-start mb-3">
                        <View className="bg-slate-100 px-3 py-1 rounded-full">
                           <Text className="font-bold text-slate-500 text-xs">PYETJA {selectedQuestionIndex + 1}</Text>
                        </View>
                        {ans.is_correct ? (
                            <View className="flex-row items-center bg-green-100 px-2 py-1 rounded-full">
                                <CheckCircle2 size={14} color="#15803d" />
                                <Text className="text-green-700 text-xs font-bold ml-1">E SAKTË</Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center bg-red-100 px-2 py-1 rounded-full">
                                <XCircle size={14} color="#b91c1c" />
                                <Text className="text-red-700 text-xs font-bold ml-1">E GABUAR</Text>
                            </View>
                        )}
                    </View>

                    <Text className="text-slate-900 font-bold text-lg mb-4 leading-6">
                      {ans.question?.question_text || "Pyetje e panjohur"}
                    </Text>
                    
                    {ans.question?.image_url && (
                        <View className="mb-4 rounded-xl overflow-hidden border border-slate-200">
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
                                <Text className="text-xs text-red-500 font-bold mb-1 uppercase tracking-wider">Përgjigja juaj</Text>
                                <Text className="text-red-900 font-medium">
                                  {ans.question?.[`option_${ans.selected_answer.toLowerCase()}`] || ans.selected_answer}
                                </Text>
                            </View>
                        )}
                        
                        {/* Correct Answer */}
                        <View className="bg-green-50 p-4 rounded-2xl border border-green-100">
                            <Text className="text-xs text-green-600 font-bold mb-1 uppercase tracking-wider">Përgjigja e saktë</Text>
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
            <TouchableOpacity onPress={() => {
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
            }}>
              <LinearGradient
                colors={['#1e1b4b', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-full py-4 items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Text className="text-white font-bold text-lg italic tracking-wide">{isPassed ? "Riprovo testin" : "Provo përsëri"}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Button
              label="Kthehu te Testet"
              variant="secondary"
              onPress={() =>
                navigation.navigate("App", {
                  screen: "Testet",
                })
              }
              className="w-full bg-white border border-slate-200"
              textClassName="text-slate-700"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
