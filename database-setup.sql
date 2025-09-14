-- Supabase Database Setup for Fovea Focus Tracking App
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    gaze_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    file_protocol TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create prev_files table
CREATE TABLE IF NOT EXISTS public.prev_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_protocol TEXT NOT NULL,
    file_name TEXT NOT NULL,
    last_accessed TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, file_protocol)
);

-- Enable Row Level Security on tables
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prev_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for focus_sessions
CREATE POLICY "Users can view their own focus sessions" ON public.focus_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own focus sessions" ON public.focus_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own focus sessions" ON public.focus_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own focus sessions" ON public.focus_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for prev_files
CREATE POLICY "Users can view their own files" ON public.prev_files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files" ON public.prev_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files" ON public.prev_files
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" ON public.prev_files
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON public.focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_created_at ON public.focus_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prev_files_user_id ON public.prev_files(user_id);
CREATE INDEX IF NOT EXISTS idx_prev_files_last_accessed ON public.prev_files(last_accessed DESC);

-- Grant permissions
GRANT ALL ON public.focus_sessions TO authenticated;
GRANT ALL ON public.prev_files TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
