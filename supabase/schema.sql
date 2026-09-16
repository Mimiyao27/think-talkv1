-- schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Exercises
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    grade_level INTEGER NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Attempts
CREATE TABLE attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL, -- Assuming integration with Supabase Auth later
    exercise_id UUID REFERENCES exercises(id),
    transcript TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Evaluations
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
    grammar_status TEXT NOT NULL,
    grammar_feedback TEXT NOT NULL,
    meaning_status TEXT NOT NULL,
    meaning_feedback TEXT NOT NULL,
    completeness_status TEXT NOT NULL,
    completeness_feedback TEXT NOT NULL,
    relevance_status TEXT NOT NULL,
    relevance_feedback TEXT NOT NULL,
    score INTEGER NOT NULL,
    overall_feedback TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Basic Row Level Security (RLS) setup (Stage 6 will expand this with Auth)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Allow read access to all for exercises
CREATE POLICY "Allow public read access to exercises" ON exercises FOR SELECT USING (true);

-- Allow authenticated users to insert and read their own attempts
CREATE POLICY "Allow users to manage their attempts" ON attempts FOR ALL USING (auth.uid() = student_id);

-- Allow authenticated users to insert and read their evaluations
CREATE POLICY "Allow users to manage their evaluations" ON evaluations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM attempts 
        WHERE attempts.id = evaluations.attempt_id 
        AND attempts.student_id = auth.uid()
    )
);
