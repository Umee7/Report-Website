create or replace function get_running_origin()
returns text
language plpgsql
as $$
begin
  return 'http://localhost:5173';
end
$$;


create or replace function get_request_host()
returns text
language plpgsql
as $$
declare
  host text;
begin
  host := 
  return host;
end $$;


CREATE OR REPLACE FUNCTION get_header(item text) RETURNS text
    LANGUAGE sql STABLE
    AS $$
    SELECT (current_setting('request.headers', true)::json)->>item
$$;


create or replace function new_post(
  title varchar, username varchar, content text, files json, country varchar, category varchar, reference_id varchar
) returns json
language plpgsql as $$
declare
  response json;
  inserted boolean;
begin
  if(length(trim(title)) >= 5 AND length(trim(title)) <= 100) then
    if(length(trim(username)) >= 0 AND length(trim(username)) <= 32) then
      if(length(trim(content)) >= 0 AND length(trim(content)) <= 2048) then
        if(json_array_length(files) <= 5) then
          if(exists(SELECT code FROM countries WHERE code=country)) then
            if(exists(SELECT code FROM categories WHERE code=category)) then
              if(length(trim(reference_id)) <= 72) then
                INSERT INTO posts(title, username, content, files, country, category, reference_id) VALUES(
                  title, username, content, files, country, category, reference_id
                );
                inserted := true;
              end if;
            end if;
          end if;
        end if;
      end if;
    end if;
  end if;

  if (inserted = true) then
    response := '{"status": "ok"}';
  else
    response := '{"status": "error"}';
  end if;

  return response;
end
$$;



create or replace function get_posts(from_date timestamp with time zone, country_specific varchar, category_specific varchar)
returns TABLE(
      title varchar,
      username varchar,
      content text,
      files json,
      country varchar,
      category varchar,
      reference_id varchar,
      created_date timestamp with time zone,
      comments_count bigint
    )
language plpgsql
as $$
begin

  if(upper(country_specific) = 'ALL' AND upper(category_specific) = 'ALL') then
    return query SELECT posts.title, posts.username, posts.content, posts.files, posts.country, posts.category, posts.reference_id, posts.created_date, count(comments.id) as comments_count from posts left join comments on posts.id = comments.post_id where posts.created_date < from_date group by posts.id order by posts.created_date desc LIMIT 15;

  elsif(upper(country_specific) = 'ALL' AND upper(category_specific) != 'ALL') then
    return query SELECT posts.title, posts.username, posts.content, posts.files, posts.country, posts.category, posts.reference_id, posts.created_date, count(comments.id) as comments_count from posts left join comments on posts.id = comments.post_id where posts.category=category_specific and posts.created_date < from_date group by posts.id order by posts.created_date desc LIMIT 15;
  
  elsif(upper(country_specific) != 'ALL' AND upper(category_specific) = 'ALL') then
    return query SELECT posts.title, posts.username, posts.content, posts.files, posts.country, posts.category, posts.reference_id, posts.created_date, count(comments.id) as comments_count from posts left join comments on posts.id = comments.post_id where posts.country=country_specific and posts.created_date < from_date group by posts.id order by posts.created_date desc LIMIT 15;

  else
    return query SELECT posts.title, posts.username, posts.content, posts.files, posts.country, posts.category, posts.reference_id, posts.created_date, count(comments.id) as comments_count from posts left join comments on posts.id = comments.post_id where posts.country=country_specific and posts.category=category_specific and posts.created_date < from_date group by posts.id order by posts.created_date desc LIMIT 15;

  end if;

end
$$;


create or replace function get_post(reference_id_param varchar)
returns TABLE(
      title varchar,
      username varchar,
      content text,
      files json,
      country varchar,
      category varchar,
      reference_id varchar,
      created_date timestamp with time zone,
      comments_count bigint
    )
language plpgsql
as $$
begin

  return query SELECT posts.title, posts.username, posts.content, posts.files, posts.country, posts.category, posts.reference_id, posts.created_date, count(comments.id) as comments_count from posts left join comments on posts.id = comments.post_id where posts.reference_id = reference_id_param group by posts.id;

end
$$;


create or replace function get_comments(referenceId varchar, from_date timestamp with time zone)
returns table(
  data varchar,
  created_date timestamp with time zone
)
language plpgsql
as $$
declare
  post_uid uuid := null;
begin
  SELECT posts.id INTO post_uid FROM posts WHERE posts.reference_id = referenceId LIMIT 1;
  return query SELECT comments.data as data, comments.created_date as created_date FROM comments WHERE comments.post_id = post_uid AND comments.created_date < from_date ORDER BY comments.created_date DESC LIMIT 10;
end
$$;


create or replace function new_comment(referenceId varchar, comment_data varchar)
returns json
language plpgsql as $$
declare
  response json;
  post_uuid uuid := null;
  inserted boolean;  
begin
  if(LENGTH(comment_data) > 0 AND LENGTH(comment_data) <= 512) then
    SELECT INTO post_uuid posts.id FROM posts WHERE posts.reference_id = referenceId;
    if(exists(SELECT posts.id FROM posts WHERE posts.reference_id = referenceId)) then
      INSERT INTO comments(data, post_id) VALUES(comment_data, post_uuid);
      inserted := true;
    end if;
  end if;

  if (inserted = true) then
    response := '{"status": "ok"}';
  else
    response := '{"status": "error"}';
  end if;

  return response;
end
$$;

