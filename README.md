# Work & Pay — MERN Edition

A MERN rewrite of the supplied WorkPaymentManager ASP.NET MVC application. This project keeps the main workflow and adds the requested customer/payment changes.

## Included

- React + Vite responsive dashboard and management UI
- Express + Node.js REST API
- MongoDB Atlas / MongoDB Compass storage using Mongoose
- User registration and login; password hashes use bcrypt; API sessions use signed JWTs
- Customers: name and Instagram profile URL only (no address or mobile number fields)
- Work records, dates, value, status, completed/remaining descriptions and progress history
- Advance and additional payments (no payment-method field)
- Payment received and remaining-balance calculations
- Unique public customer status links; disable/reissue a link
- Public status page polls the API every 20 seconds
- Per-user ownership checks on authenticated API routes

## Requirements

- Node.js 20.19+ or 22.12+
- A free MongoDB Atlas M0 cluster, or a local MongoDB server
- MongoDB Compass (optional desktop viewer)

## 1. Create MongoDB Atlas database

1. Create a free Atlas account at https://www.mongodb.com/cloud/atlas/register.
2. Create an M0 free cluster.
3. In **Database Access**, create a database user and password.
4. In **Network Access**, allow your current IP for development. For hosted deployment, allow the hosting provider's outbound IPs if known. Avoid leaving broad access enabled unnecessarily.
5. Select **Connect → Drivers → Node.js** and copy the connection string.
6. Replace `<db_password>` with the database user's password and use the database name `workpaymentmanager`.
7. The same Atlas cluster can be opened in MongoDB Compass using the connection string.

## 2. Configure and run the backend

Open a terminal in `server`:

```bash
npm install
```

Copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGODB_URI=mongodb+srv://DB_USER:DB_PASSWORD@YOUR_CLUSTER.mongodb.net/workpaymentmanager?retryWrites=true&w=majority
JWT_SECRET=use-a-long-random-secret-at-least-32-characters
CLIENT_URL=http://localhost:5173
```

Do not commit `.env` or share your connection string. Start the API:

```bash
npm run dev
```

API health check: http://localhost:5000/api/health

## 3. Run the React frontend

Open a second terminal in `client`:

```bash
npm install
npm run dev
```

Open http://localhost:5173. Register your owner account, add customers, create works and record payments.

If your backend is hosted at a different URL, create `client/.env`:

```env
VITE_API_URL=https://YOUR-API-DOMAIN/api
```

Then rebuild the frontend with `npm run build`.

## 4. View records in MongoDB Compass

1. Open MongoDB Compass.
2. Paste the same Atlas connection string.
3. Connect and open the `workpaymentmanager` database.
4. Collections are created automatically when records are first saved: `users`, `customers`, and `works`.

Payments and progress updates are embedded in their parent work document (`works` collection), so each work and its history remain together.

## Main API routes

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/customers`, `PUT/DELETE /api/customers/:id`
- `GET /api/works`, `GET /api/works/summary`, `POST /api/works`
- `GET/PUT/DELETE /api/works/:id`
- `POST /api/works/:id/payments`, `DELETE /api/works/:id/payments/:paymentId`
- `POST /api/works/:id/progress`
- `POST /api/works/:id/share`, `POST /api/works/:id/share/disable`
- `GET /api/public-status/:token` (public; share token required)

Authenticated routes require `Authorization: Bearer <JWT>`.

## Deployment notes

Deploy the Express API and React frontend as separate services (or serve the built React app from a static host). Set environment variables in the hosting dashboard. Use HTTPS, a strong unique JWT secret, restricted Atlas network access, and backups before storing real customer records. The free Atlas tier has limited storage and throughput; check the current Atlas limits before production use.

## Important implementation note

This is a new MERN application, not an ASP.NET project with its connection string swapped. The original archive is retained as the functional reference. Existing SQL Server data is not automatically migrated; export/import would be a separate step if you need to carry existing records over.


## Local development and Vercel deployment without a GitHub commit

This project uses one frontend codebase for both local and hosted use. The frontend API
base URL is selected by `VITE_API_URL` at build/dev-server start.

### Local frontend + local Render-independent API
1. In `server/.env`, configure `PORT`, `MONGODB_URI`, `JWT_SECRET`, and
   `CLIENT_URL=http://localhost:5173`.
2. Start the API from `server`: `npm install` then `npm run dev`.
3. In `client/.env`, set `VITE_API_URL=http://localhost:5000/api`.
4. Start the frontend from `client`: `npm install` then `npm run dev`.
5. Open `http://localhost:5173`.

### Local frontend + deployed Render API
Set `client/.env` to:
`VITE_API_URL=https://workpaymentmanager-1.onrender.com/api`
Restart Vite after changing the environment file.

### Deploy the current local frontend files to Vercel without committing/pushing
1. In the Vercel project settings, set the Root Directory to `client` (if it is not
   already set), Framework Preset to Vite, Build Command to `npm run build`, and
   Output Directory to `dist`.
2. Add Environment Variable `VITE_API_URL` with value
   `https://workpaymentmanager-1.onrender.com/api` for Production (and Preview if
   previews should use the hosted API).
3. Install/use Vercel CLI: `npm i -g vercel`.
4. Open a terminal in this project's `client` folder and run `vercel`.
   Link it to the existing Vercel project when prompted. Do not change the project's
   Root Directory to the repository root.
5. Deploy to production with `vercel --prod`. This uploads the current local
   frontend files to Vercel; no Git commit or push is required.
6. Test `/login`, `/register`, refresh a nested route, and sign in. `client/vercel.json`
   provides the SPA rewrite needed by React Router.

Note: Vercel CLI deployment updates the frontend only. It does not upload changes to
the Express backend on Render. The existing Render API must already contain the backend
code you need. Backend source-code changes generally require a Render deployment from
its connected Git repository (which would require a commit/push), unless you change the
backend's deployment source/hosting approach.

### Render environment variables
In Render → your API service → Environment, set:
- `MONGODB_URI`: the Atlas connection string
- `JWT_SECRET`: a long random secret
- `CLIENT_URL`: `https://work-payment-manager.vercel.app` (your exact production
  frontend origin, no `/login`, no `/api`, and no trailing slash)
- `NODE_ENV=production`

The backend currently allows `http://localhost:5173` and
`https://work-payment-manager.vercel.app` in its CORS allowlist. If your Vercel
production domain differs, the backend CORS allowlist must be updated and deployed.

### Security
Never put `MONGODB_URI` or `JWT_SECRET` in the Vite frontend or any `VITE_*` variable.
Only the API base URL belongs in `VITE_API_URL`. Do not share `.env` files. This
prepared source bundle excludes the uploaded `.env` files and `node_modules`.
