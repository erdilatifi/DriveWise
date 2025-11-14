# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## How to Get These Values:

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Settings > API**
4. **Copy the values:**
   - **URL**: Copy the "Project URL"
   - **Key**: Copy the "anon public" key

## Example .env.local file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Important Notes:

- **Never commit the .env.local file to git**
- **The .env.local file should be in the root directory** (same level as package.json)
- **Restart the development server** after creating/modifying the .env.local file
- **Both variables must start with `NEXT_PUBLIC_`** to be accessible in the browser

## Troubleshooting:

If you get a 500 Internal Server Error, it's likely because:
1. The .env.local file is missing
2. The environment variables are incorrect
3. The Supabase project is not accessible

## After Setting Up:

1. Restart your development server: `npm run dev`
2. The app should now work on the port shown in the terminal (usually 3000 or 3001)
