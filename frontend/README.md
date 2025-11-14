# Customizable Dashboard - Frontend

A modern Next.js frontend for a customizable dashboard application with authentication and widget management.

## Features

- User authentication (register/login)
- Customizable widget dashboard
- Three widget types:
  - Clock: Real-time clock with date
  - Notes: Quick note-taking
  - Todo: Task management
- Persistent storage via backend API
- Responsive design with Tailwind CSS

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Zustand (State Management)
- Axios (HTTP Client)
- Tailwind CSS (Styling)
- Lucide React (Icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Utilities and API client
└── store/           # Zustand state management
```

## Usage

1. Register a new account or login
2. Add widgets to your dashboard
3. Customize each widget (notes, todos)
4. Save your dashboard to persist changes
5. Logout when done
