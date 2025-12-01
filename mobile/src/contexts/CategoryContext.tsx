import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    AsyncStorage.getItem('selectedCategory').then((value) => {
      if (value) setSelectedCategory(value);
      setLoading(false);
    });
  }, []);

  const setCategory = async (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      await AsyncStorage.setItem('selectedCategory', category);
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

