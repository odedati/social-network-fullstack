# Deployment: Supabase + Render

## 1. Supabase

1. Create a Supabase project.
2. Go to SQL Editor.
3. Paste and run the contents of:

   `social-network-backend/schema.postgres.sql`

4. Click Connect and copy the Session Pooler connection string.
   Use the version that looks like:

   `postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`

## 2. Render backend

Create a new Web Service.

- Root Directory: `social-network-backend`
- Language: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

- `DB_CLIENT=postgres`
- `DATABASE_URL=<the Supabase Session Pooler connection string>`
- `PGSSLMODE=require`
- `bcrypt_saltRounds=10`
- `spooncular_apiKey=<your Spoonacular API key>`

Render sets `PORT` automatically for web services.

After deploy, check:

`https://<backend-name>.onrender.com/alive`

## 3. Render frontend

Create a new Static Site.

- Root Directory: `social-network-frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

Environment variables:

- `VUE_APP_SERVER_DOMAIN=https://<backend-name>.onrender.com`

After deploy, open:

`https://<frontend-name>.onrender.com`

## Notes

- The backend uses MySQL locally unless `DB_CLIENT=postgres` or `DATABASE_URL` is set.
- The frontend reads `VUE_APP_SERVER_DOMAIN` at build time, so redeploy it after changing the backend URL.
- The current app uses local sessions/cookies. Cross-domain login can require cookie/CORS tightening after the first public deploy.
