
-- Fix search_path on touch_updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql
security invoker
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

-- Revoke public execute on SECURITY DEFINER trigger fns (they only need to run as triggers)
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.update_streak() from public, anon, authenticated;
