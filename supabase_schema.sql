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