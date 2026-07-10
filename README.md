# CoolAir Co. — Website

React (Vite + React Router) implementation of the CoolAir Co. Website Blueprint.

## Run it

```bash
cd AC_web
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## What's implemented (mapped to the blueprint)

| Blueprint section | Where |
|---|---|
| §2 Homepage (hero, AI quote widget, services grid, comparison table, reviews carousel, area map, savings calculator, footer) | `src/pages/Home.jsx` |
| §3 Navigation — 6 top-level items + Services dropdown (5 sub-pages) + Book Now CTA | `src/components/Navbar.jsx`, `src/pages/ServicePage.jsx` |
| §4 AI chat concierge (triage → booking handoff) | `src/components/ChatConcierge.jsx` |
| §4 Energy savings calculator | `src/components/SavingsCalculator.jsx` |
| §5 Shop — browse-and-quote catalog with "Get installed" bundling | `src/pages/Shop.jsx` |
| §6 User journeys — booking flow + role dashboards | `src/pages/Book.jsx`, `src/pages/Dashboard.jsx` |
| §7 One login, three roles (customer/admin/technician), tabbed login/signup, Google button, low-visibility staff link | `src/pages/Login.jsx`, `src/auth.jsx` |
| §8 Database shape | mirrored as mock data in `src/data.js` |

## Demo accounts

Password for all: `demo123`

- `customer@demo.com` → customer dashboard (appointments, invoices, plan)
- `admin@demo.com` → dispatch CRM view
- `tech@demo.com` → technician job list

## Currently mocked → swap for real services later (blueprint §9)

- **Auth + data**: localStorage / `src/data.js` → Supabase (Postgres + Auth + Storage)
- **AI quote & chat**: heuristic scoring / keyword replies → Claude API
- **Payments**: none yet → Stripe
- **Maps**: placeholder panel → Google Maps embed
- **Notifications**: none yet → Resend / Twilio
