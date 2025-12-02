import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@drivewise/core';

type CategoryContextType = {
  selectedCategory: string | null;
  setCategory: (category: string | null) => void;
  loading: boolean;
};

const CategoryContext = createContext<CategoryContextType>({
  selectedCategory: null,
  setCategory: () => {},
  loading: true,
});

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  // Prefetch test count for a category
  const prefetchTestCount = async (category: string) => {
    queryClient.prefetchQuery({
      queryKey: ['test-count', category],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('admin_questions')
          .select('test_number')
          .eq('category', category);
        if (error) throw error;
        const uniqueTests = [...new Set(((data || []) as any[]).map(q => q.test_number))];
        return uniqueTests.length;
      },
      staleTime: 10 * 60 * 1000,
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('selectedCategory').then((value) => {
      if (value) {
        setSelectedCategory(value);
        // Prefetch immediately when loading saved category
        prefetchTestCount(value);
      }
      setLoading(false);
    });
  }, []);

  const setCategory = async (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      await AsyncStorage.setItem('selectedCategory', category);
      // Prefetch test count immediately when category is selected
      prefetchTestCount(category);
    } else {
      await AsyncStorage.removeItem('selectedCategory');
    }
  };

  return (
    <CategoryContext.Provider value={{ selectedCategory, setCategory, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

