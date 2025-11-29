import React, { createContext, useContext, useState } from 'react';

type CategoryContextType = {
  selectedCategory: string | null;
  setCategory: (category: string | null) => void;
};

const CategoryContext = createContext<CategoryContextType>({
  selectedCategory: null,
  setCategory: () => {},
});

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <CategoryContext.Provider value={{ selectedCategory, setCategory: setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
