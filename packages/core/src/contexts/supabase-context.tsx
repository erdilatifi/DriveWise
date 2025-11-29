import React, { createContext, useContext, ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const SupabaseContext = createContext<SupabaseClient<Database> | null>(null);

export interface SupabaseProviderProps {
  client: SupabaseClient<Database>;
  children: ReactNode;
}

export const SupabaseProvider = ({ client, children }: SupabaseProviderProps) => {
  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
