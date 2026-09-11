-- SQL Function to automatically create a User in the public schema when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public."User" (id, email, nom, prenom, cree_le)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'nom',
    new.raw_user_meta_data ->> 'prenom',
    now()
  );
  return new;
end;
$$;

-- Trigger to call the function every time a user is inserted into auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
