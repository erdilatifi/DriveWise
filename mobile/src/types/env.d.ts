// mobile/src/types/env.d.ts
declare module '@env' {
    export const API_URL: string;
    export const SUPABASE_URL: string;
    export const SUPABASE_ANON_KEY: string;
}

// Add declarations for image files
declare module '*.png' {
  const value: any;
  export = value;
}
declare module '*.jpg' {
  const value: any;
  export = value;
}
declare module '*.jpeg' {
  const value: any;
  export = value;
}
declare module '*.svg' {
  const value: any;
  export = value;
}
