# She Knows

> A private, women-centered web platform where university students can share experiences, ask for advice, review products, and protect each other — anonymously and without judgment.

---

## Overview

She Knows is a community-driven Single Page Application (SPA) built for university women. It provides a trusted digital space where real conversations happen, real opinions matter, and collective knowledge empowers its users.

The platform exists because many women lack a safe, non-judgmental environment to talk openly about dating, relationships, beauty, and personal experiences. Paid promotions distort product recommendations, and information about men and dating is scattered and unreliable.

She Knows brings everything into one place: anonymous conversations, honest product reviews beyond influencer culture, and a shared safety layer for navigating relationships. Access is restricted to institutional email addresses to ensure a trusted, bounded community.

---

## Current Scope

### Features

* **Girl Talk** — Anonymous feed where users can post thoughts, experiences, or questions and interact through likes and comments
* **Men Under Review** — Users can post experiences about men with a red/green flag voting system, searchable by name
* **Products We Trust** — Community-driven product reviews (makeup, skincare, gym, clothing) with star ratings, category feeds, weekly top-rated filter, and trending products
* **Anonymous Profiles** — Auto-generated usernames and avatars on registration; no real names or photos required
* **User Profiles** — Personal profile page showing own posts; ability to view other users' profiles by ID
* **Protected Routes** — All core sections are inaccessible without an active session

### Status

> The repository has completed its core architecture and all primary features. The platform currently uses open Row Level Security policies suitable for academic development. Production hardening (per-user RLS, email domain validation enforcement) is scoped for future iterations.

---

## Architecture

### Responsibilities

* Authenticate users via Firebase and persist session state globally through `AuthContext`
* Auto-generate an anonymous profile (username + DiceBear avatar) in Supabase on first login
* Provide isolated feature Contexts (`GirlTalkContext`, `MenReviewContext`, `ProductsContext`) that handle all data fetching, mutations, and local state for each section
* Protect all non-auth routes via `ProtectedRoute`, redirecting unauthenticated users to `/login`
* Serve images uploaded by users (product photos, men review photos) through Supabase Storage buckets
* Calculate trending products client-side using `useMemo` over the loaded posts state, without additional database queries

### Integrations

* **Firebase Authentication** — Email/password auth, session persistence, `onAuthStateChanged` listener
* **Supabase** — PostgreSQL database (posts, likes, comments, votes, profiles), SQL views for aggregated feeds, Storage buckets for user-uploaded images
* **DiceBear API** — Generates unique SVG avatars per user via randomized seed URLs

---

## Tech Stack

| Category       | Technologies                                        |
| -------------- | --------------------------------------------------- |
| Core           | React 19, TypeScript 5.9, Vite 8                    |
| Routing        | React Router DOM 7                                  |
| Auth           | Firebase 12                                         |
| Database       | Supabase JS 2 (PostgreSQL + Storage)                |
| State          | React Context API (`useContext`)                     |
| Icons          | Lucide React                                        |
| Tooling        | ESLint 9, typescript-eslint                         |

> See `package.json` for exact versions.

---

## Getting Started

### Prerequisites

* Node.js 22+
* npm

### Installation

```bash
git clone https://github.com/icalvo0130/SHE-KNOWS
cd SHE-KNOWS
npm install
```

### Run Locally

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file at the root of the project with the following variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Contact the maintainers for environment-specific values. Do not commit `.env` to version control.

---

## Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server (Vite)          |
| `npm run build`   | Type-check and create production build   |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint across the project            |

---

## Project Structure

```text
src/
├── assets/          # Images and static resources
├── components/      # Reusable UI elements (PostCard, NavBar, Header, Forms, ProductCard)
├── context/         # Global state providers (AuthContext, GirlTalkContext, MenReviewContext, ProductsContext)
├── data/            # External service configuration (firebase.ts, supabase.ts)
├── pages/           # Full-screen route components (GirlTalk, MenReview, Products, Profile, Login, Register, Welcome)
├── routes/          # ProtectedRoute component
├── types/           # Centralized TypeScript type definitions (Post.ts, Auth.ts, Helpers.ts)
└── main.tsx         # Application entry point
```

---

## Ownership

**Team:** She Knows — Academic Web Development Project

**Maintainers:**
* Isabela Calvo — [@icalvo0130](https://github.com/icalvo0130)
* Nicole Dayan Miranda
