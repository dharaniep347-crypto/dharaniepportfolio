create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where role = 'admin') $$;
grant execute on function public.admin_exists() to anon, authenticated;

-- Block new signups once an admin exists; first signup becomes admin.
create or replace function public.guard_signup()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if exists (select 1 from public.user_roles where role = 'admin') then
    raise exception 'Registration is closed';
  end if;
  return new;
end $$;
create trigger guard_signup before insert on auth.users
  for each row execute function public.guard_signup();

create or replace function public.assign_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger assign_first_admin after insert on auth.users
  for each row execute function public.assign_first_admin();

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  short_description text not null default '' check (char_length(short_description) <= 300),
  description text not null default '' check (char_length(description) <= 20000),
  image_url text,
  technologies text[] not null default '{}',
  category text not null default 'Web',
  live_url text not null default '',
  github_url text not null default '',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "Anyone reads projects" on public.projects for select using (true);
create policy "Admins insert projects" on public.projects for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update projects" on public.projects for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete projects" on public.projects for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Profile (single row)
create table public.profile (
  id integer primary key default 1 check (id = 1),
  name text not null default '',
  title text not null default '',
  bio text not null default '',
  about text not null default '',
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  education text not null default '',
  avatar_url text,
  resume_url text,
  socials jsonb not null default '{}'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.profile to anon, authenticated;
grant insert, update on public.profile to authenticated;
grant all on public.profile to service_role;
alter table public.profile enable row level security;
create policy "Anyone reads profile" on public.profile for select using (true);
create policy "Admins insert profile" on public.profile for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update profile" on public.profile for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete profile" on public.profile for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 255),
  subject text not null check (char_length(subject) between 3 and 150),
  message text not null check (char_length(message) between 10 and 2000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "Anyone sends messages" on public.messages for insert to anon, authenticated with check (read = false);
create policy "Admins read messages" on public.messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update messages" on public.messages for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete messages" on public.messages for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Storage policies for portfolio-files
create policy "Public reads portfolio files" on storage.objects for select using (bucket_id = 'portfolio-files');
create policy "Admins upload portfolio files" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-files' and public.has_role(auth.uid(), 'admin') and (
    ((storage.foldername(name))[1] in ('projects','avatar') and lower(storage.extension(name)) in ('png','jpg','jpeg','webp','gif'))
    or ((storage.foldername(name))[1] = 'resume' and lower(storage.extension(name)) = 'pdf')));
create policy "Admins update portfolio files" on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-files' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete portfolio files" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-files' and public.has_role(auth.uid(), 'admin'));

-- Seed content
insert into public.profile (id, name, title, bio, about, email, phone, location, education, resume_url, socials, skills) values (1,
 'Dharani E P', 'AI and Full Stack Developer',
 'Third-year AI and Data Science student building AI-powered full-stack web apps.',
 E'I''m a third-year B.Tech student in Artificial Intelligence and Data Science at PGP College of Engineering and Technology. I''m interested in AI-powered full-stack development and in building useful applications that combine web technologies with AI.\n\nI work with React, Spring Boot, Node.js and Express, with MySQL and MongoDB for data and AWS for deployment. I''m eager to strengthen my practical skills through projects and collaborative learning.',
 'dharaniep347@gmail.com', '+91 9159048874', 'Karur, Tamil Nadu, India',
 'B.Tech in Artificial Intelligence and Data Science (third year), PGP College of Engineering and Technology',
 '/Dharani_EP_Resume.pdf',
 '{"github":"https://github.com/dharaniep347-crypto","linkedin":"https://www.linkedin.com/in/dharani-e-p-64a32b338"}',
 '[{"name":"Python","level":80,"category":"Languages"},{"name":"JavaScript","level":85,"category":"Languages"},{"name":"SQL","level":75,"category":"Languages"},{"name":"React.js","level":85,"category":"Frontend"},{"name":"Tailwind CSS","level":80,"category":"Frontend"},{"name":"Spring Boot","level":70,"category":"Backend"},{"name":"Node.js","level":75,"category":"Backend"},{"name":"Express.js","level":75,"category":"Backend"},{"name":"MySQL","level":75,"category":"Databases"},{"name":"MongoDB","level":75,"category":"Databases"},{"name":"AWS","level":60,"category":"Cloud and Tools"},{"name":"Git and GitHub","level":80,"category":"Cloud and Tools"}]');

insert into public.projects (title, short_description, description, technologies, category, featured, sort_order) values
 ('TravelMind: AI-Powered Personalized Itinerary Planner','Plans personalized travel itineraries with AI.','<p>TravelMind plans personalized travel itineraries with AI, combining a full-stack web app with AI-generated recommendations.</p>','{AI,"Full Stack"}','AI',true,0),
 ('AI Learning Management System','An AI-focused LMS that supports digital learning workflows.','<p>An AI-focused learning management system that supports digital learning workflows.</p>','{AI,"Full Stack"}','AI',true,1),
 ('My Portfolio','A 3D animated personal portfolio website.','<p>A 3D animated personal portfolio website presenting my profile and projects.</p>','{React,Three.js,"Tailwind CSS"}','Web',false,2),
 ('Smart Irrigation Prediction','An agriculture-focused prediction project for smart irrigation.','<p>An agriculture-focused prediction project for smart irrigation.</p>','{Python,"Data Science"}','AI',false,3);