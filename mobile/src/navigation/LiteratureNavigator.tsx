import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialsScreen } from '../screens/main/MaterialsScreen';
import { SignsCategoryScreen } from '../screens/literature/SignsCategoryScreen';
import { SignsListScreen } from '../screens/literature/SignsListScreen';
import { MaterialDetailScreen } from '../screens/main/MaterialDetailScreen';

export type LiteratureStackParamList = {
  MaterialsHome: undefined;
  MaterialDetail: { materialId: string; title: string };
  SignsCategory: undefined;
  SignsList: { categoryId: string; title: string };
};

const Stack = createNativeStackNavigator<LiteratureStackParamList>();

export const LiteratureNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MaterialsHome" component={MaterialsScreen} />
      <Stack.Screen name="MaterialDetail" component={MaterialDetailScreen} />
      <Stack.Screen name="SignsCategory" component={SignsCategoryScreen} />
      <Stack.Screen name="SignsList" component={SignsListScreen} />
    </Stack.Navigator>
  );
};

