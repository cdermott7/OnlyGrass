# Database Setup Instructions

The authentication is failing because the database tables haven't been created yet. Follow these steps:

## 1. Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your project: `kzmmaimlfivviexgjdlf`

## 2. Create Database Schema
1. In the left sidebar, click on "SQL Editor"
2. Click "New Query" 
3. Copy and paste the entire contents of `supabase-schema.sql` into the SQL editor
4. Click "Run" to execute the schema

## 3. Enable Storage (Optional)
1. Go to "Storage" in the left sidebar
2. Create a new bucket called `challenge-photos`
3. Set it to public if you want direct image access

## 4. Test the Setup
After running the SQL schema, restart your development server:
```bash
npm run dev
```

The authentication should now work properly!

## What This Creates
- ✅ `profiles` table for user data
- ✅ `challenges` table for grass-touching challenges  
- ✅ `achievements` table for user achievements
- ✅ `friendships` table for social features
- ✅ Row Level Security policies
- ✅ Automatic profile creation on signup
- ✅ Database triggers for timestamps

## Troubleshooting
If you still get errors:
1. Check that all tables were created in the "Table Editor"
2. Verify RLS policies are enabled
3. Check browser console for specific error messages