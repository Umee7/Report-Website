create table if not exists countries(
  code varchar(16) primary key not null,
  name varchar(224) not null
);

create table if not exists categories(
  code varchar(32) primary key not null,
  name varchar(64) not null
);

create table if not exists posts(
  id uuid primary key default gen_random_uuid(),
  title varchar(101) not null,
  username varchar(33) null,
  content text not null,
  files json not null,
  country varchar(64) not null,
  category varchar(32) not null,
  reference_id varchar(72) not null unique,

  created_date timestamp with time zone not null default now()
);


create table if not exists comments(
  id uuid primary key default gen_random_uuid(),
  data varchar(512) not null,
  created_date timestamp with time zone not null default now(),

  post_id uuid references posts(id) on delete cascade
);
