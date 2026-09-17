-- Extend expenses with the fields the real request form needs: a fixed
-- category (not free text, so filtering/reporting stays reliable), where
-- the money is needed, when it's needed by, and a place to point at an
-- uploaded receipt once Supabase Storage is wired in (not yet).
alter table expenses
  add column category text not null default 'other'
    check (category in ('provisioning', 'fuel', 'docking', 'maintenance', 'other')),
  add column port text,
  add column date_needed date,
  add column receipt_path text;

-- Drop the temporary default now that the form will always send an
-- explicit category going forward -- the default only existed so this
-- migration doesn't fail on the test row you already submitted.
alter table expenses
  alter column category drop default;