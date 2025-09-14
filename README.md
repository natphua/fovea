# Fovea - Focus Tracking App

A Next.js application that uses eye-tracking technology to measure and improve your focus while reading or working. Built with Supabase for authentication and data persistence.

## Features

- 🔍 **Eye Tracking**: Advanced webcam-based eye tracking to monitor focus patterns
- 📊 **Focus Analytics**: Detailed insights into attention patterns and concentration levels
- 📈 **Progress Tracking**: Track focus improvement over time with detailed reports
- 🔐 **User Authentication**: Secure login/signup with Supabase Auth
- 📁 **File Management**: Track previously opened files and their focus sessions
- 🎯 **Focus Scoring**: Get quantified focus scores and recommendations

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `database-setup.sql` to create the required tables and policies

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

### Tables

- **focus_sessions**: Stores user focus session data with gaze points and metrics
- **prev_files**: Tracks previously opened files and access times
- **auth.users**: Supabase built-in user authentication (managed automatically)

### Supabase Free Plan Compatibility

This app is designed to work within Supabase's free tier limits:
- ✅ 500MB database storage
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth
- ✅ Row Level Security enabled

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages (login/signup)
│   ├── dashboard/         # User dashboard
│   ├── results/           # Focus session results
│   └── session/           # Focus session tracking
├── components/            # React components
├── contexts/              # React contexts (Auth)
├── hooks/                 # Custom React hooks
├── lib/
│   ├── focus/            # Focus tracking logic
│   └── supabase/         # Supabase configuration
└── ...
```

## Key Features Implementation

### Authentication Flow
- Landing page with sign in/up options
- Protected routes redirect to login
- User session stored in cookies via Supabase Auth
- Automatic redirect to dashboard after login

### Focus Tracking
- Real-time eye tracking using WebGazer.js
- Gaze data collection and analysis
- Focus metrics computation (stability, engagement, etc.)
- Session persistence to both localStorage and Supabase

### Dashboard
- View recent focus sessions with scores
- Browse previously accessed files
- Quick access to start new sessions
- Focus score trends and insights

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, DaisyUI
- **Backend**: Supabase (Auth, Database, RLS)
- **Eye Tracking**: WebGazer.js
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with DaisyUI components

## Getting Your Supabase Keys

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Settings → API
3. Copy your Project URL and anon/public key
4. Add them to your `.env.local` file

That's it! The app will handle user registration, authentication, and data persistence automatically.
