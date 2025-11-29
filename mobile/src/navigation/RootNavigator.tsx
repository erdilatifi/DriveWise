import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useCategory } from '../contexts/CategoryContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { CategorySelectionScreen } from '../screens/main/CategorySelectionScreen';
import { AppNavigator } from './AppNavigator';
import { ActivityIndicator, View } from 'react-native';
import { RootStackParamList, AuthStackParamList } from './types';

import { TestInstructionsScreen } from '../screens/test/TestInstructionsScreen';
import { TestRunnerScreen } from '../screens/test/TestRunnerScreen';
import { TestResultScreen } from '../screens/test/TestResultScreen';
import { SubscriptionScreen } from '../screens/subscription/SubscriptionScreen';
import { DecisionGameScreen } from '../screens/main/DecisionGameScreen';
import { DecisionScenariosScreen } from '../screens/main/DecisionScenariosScreen';
import { PersonalizedTestsScreen } from '../screens/main/PersonalizedTestsScreen';
import { TestHistoryScreen } from '../screens/main/TestHistoryScreen';
import { PersonalInfoScreen } from '../screens/main/PersonalInfoScreen';
import { MaterialDetailScreen } from '../screens/main/MaterialDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

export const RootNavigator = () => {
  const { user, loading } = useAuth();
  const { selectedCategory } = useCategory();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ce76c9" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!selectedCategory ? (
          <Stack.Screen name="CategorySelection" component={CategorySelectionScreen} />
        ) : (
          <>
            <Stack.Screen name="App" component={AppNavigator} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="TestInstructions" component={TestInstructionsScreen} />
            <Stack.Screen name="TestRunner" component={TestRunnerScreen} />
            <Stack.Screen name="TestResult" component={TestResultScreen} />
            <Stack.Screen name="DecisionGame" component={DecisionGameScreen} />
            <Stack.Screen name="DecisionScenarios" component={DecisionScenariosScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
            <Stack.Screen name="PersonalizedTests" component={PersonalizedTestsScreen} />
            <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
            <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
            <Stack.Screen name="MaterialDetail" component={MaterialDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
