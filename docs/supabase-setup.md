# Supabase setup

Supabase is prepared as a future integration only. The current MVP still uses client-side state and localStorage.

## Future steps

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Replace the placeholder values with the project URL and anon public key.
4. Restart the Next.js dev server after changing environment variables.
5. Add authentication UI only when the product flow is ready.
6. Add database queries only after the tier list data model is finalized.

## Database migration

The tier list table SQL lives in:

`supabase/migrations/20260609_create_tier_lists.sql`

This migration is not run automatically. To apply it manually:

1. Open the Supabase project dashboard.
2. Go to SQL Editor.
3. Open `supabase/migrations/20260609_create_tier_lists.sql` locally.
4. Copy the full SQL into the SQL Editor.
5. Review the table, trigger, RLS, and policies.
6. Run the SQL in Supabase.

The migration creates `public.tier_lists`, enables Row Level Security, lets users manage their own tier lists, and allows anyone to read tier lists marked as public.

Do not commit real credentials.
