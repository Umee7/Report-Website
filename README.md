# Anon posts web app with ReactJS and Supabase

## Install requirements
```
npm i
```

## Run SQL queries on supabase project from [supabase-data/queries/](https://github.com/hakiKhuva/anon-posts-with-react-and-supabase/tree/main/supabase-data/queries)
Create bucket `post-files` in storage on supabase and set it to *Public bucket* and add policy to insert the file to all or anon.

Create tables, install the extensions, functions, policies, add triggers, grant permissions and also insert countries and categories data into table.

*Change the return statement of function `get_running_origin()` in [`functions.sql`](https://github.com/hakiKhuva/anon-posts-with-react-and-supabase/blob/main/supabase-data/queries/functions.sql) file if it's not running on `http://localhost:5173` to the live URL.*

Add supabase project url and supabase key before running project in [src/supabase.js](https://github.com/hakiKhuva/anon-posts-with-react-and-supabase/blob/main/src/supabase.js)


## Finally run the project

```
npm run dev
```
