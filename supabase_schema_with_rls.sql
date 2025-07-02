-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text not null,
  last_name text not null,
  middle_name text,
  contact_number text,
  address text,
  role text default 'resident',
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Document types table
create table if not exists document_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  requirements text[],
  fee numeric(10,2) default 0,
  processing_time text,
  is_active boolean default true
);

-- Applications table
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  document_type_id uuid references document_types(id),
  purpose text,
  status text default 'pending',
  submitted_at timestamp with time zone default now(),
  processed_at timestamp with time zone,
  completed_at timestamp with time zone,
  processed_by uuid references users(id),
  rejection_reason text,
  tracking_number text unique,
  attachments jsonb
);

-- Attachments table (optional, for file metadata)
create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  file_name text,
  file_type text,
  file_size integer,
  file_path text,
  uploaded_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_applications_user_id on applications(user_id);
create index if not exists idx_applications_document_type_id on applications(document_type_id);
create index if not exists idx_attachments_application_id on attachments(application_id);

-- Enable Row Level Security
alter table users enable row level security;
alter table document_types enable row level security;
alter table applications enable row level security;
alter table attachments enable row level security;

-- RLS Policies for users table
-- Users can read their own data
create policy "Users can view own data" on users
  for select using (auth.uid() = id);

-- Users can update their own data
create policy "Users can update own data" on users
  for update using (auth.uid() = id);

-- Admins can read all user data
create policy "Admins can view all users" on users
  for select using (
    exists (
      select 1 from users where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update all user data
create policy "Admins can update all users" on users
  for update using (
    exists (
      select 1 from users where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for document_types table
-- Anyone can read active document types
create policy "Anyone can view active document types" on document_types
  for select using (is_active = true);

-- Only admins can modify document types
create policy "Only admins can insert document types" on document_types
  for insert with check (
    exists (
      select 1 from users where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update document types" on document_types
  for update using (
    exists (
      select 1 from users where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete document types" on document_types
  for delete using (
    exists (
      select 1 from users where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for applications table
-- Users can read their own applications
create policy "Users can view own applications" on applications
  for select using (auth.uid() = user_id);

-- Users can insert their own applications
create policy "Users can insert own applications" on applications
  for insert with check (auth.uid() = user_id);

-- Users can update their own pending applications
create policy "Users can update own pending applications" on applications
  for update using (
    auth.uid() = user_id and status = 'pending'
  );

-- Admins can read all applications
create policy "Admins can view all applications" on applications
  for select using (
    exists (
      select 1 from users where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update all applications
create policy "Admins can update all applications" on applications
  for update using (
    exists (
      select 1 from users where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for attachments table
-- Users can read their own attachments
create policy "Users can view own attachments" on attachments
  for select using (
    exists (
      select 1 from applications where 
        applications.id = attachments.application_id and 
        applications.user_id = auth.uid()
    )
  );

-- Users can insert their own attachments
create policy "Users can insert own attachments" on attachments
  for insert with check (
    exists (
      select 1 from applications where 
        applications.id = attachments.application_id and 
        applications.user_id = auth.uid()
    )
  );

-- Admins can read all attachments
create policy "Admins can view all attachments" on attachments
  for select using (
    exists (
      select 1 from users where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update all attachments
create policy "Admins can update all attachments" on attachments
  for update using (
    exists (
      select 1 from users where id = auth.uid() and role = 'admin'
    )
  );

-- Create a function to handle user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, first_name, last_name, middle_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'middle_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'resident')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();