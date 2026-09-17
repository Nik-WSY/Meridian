-- A private bucket for expense receipts. Not public: files are only
-- reachable via a signed URL or through Storage's own RLS-gated read,
-- never a bare public link.
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- Storage keeps its own RLS-protected table, storage.objects, one row per
-- uploaded file. Uploads are named "<user id>/<filename>", so checking the
-- first path segment against auth.uid() IS the ownership check.
create policy "Users can upload their own receipts"
  on storage.objects for insert
  with check (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view their own receipts"
  on storage.objects for select
  using (
    bucket_id = 'receipts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Managers can view all receipts"
  on storage.objects for select
  using (
    bucket_id = 'receipts'
    and is_manager()
  );