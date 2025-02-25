-- Add this line to the user_profiles table creation:
approval_status text not null check (approval_status in ('pending', 'approved', 'rejected')) default 'pending',

