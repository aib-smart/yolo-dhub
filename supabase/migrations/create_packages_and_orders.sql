-- Create packages table
create table public.packages (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    data text not null,
    validity text not null,
    price decimal(10,2) not null,
    carrier text not null,
    active boolean default true,
    popular boolean default false
);

-- Set up Row Level Security (RLS)
alter table public.packages enable row level security;

-- Create policies
-- Allow anyone to read packages
create policy "Anyone can view packages"
on packages for select
using (true);

-- Allow admins to manage packages
create policy "Admins can manage packages"
on packages for all
using (auth.jwt()->>'role' = 'admin');

-- Create function to handle package updates
create or replace function handle_package_update()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updating updated_at
create trigger packages_updated_at
    before update on packages
    for each row
    execute function handle_package_update();

-- Create indexes
create index packages_carrier_idx on packages(carrier);
create index packages_active_idx on packages(active);

