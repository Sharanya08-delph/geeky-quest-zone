CREATE TABLE public.daily_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  streak_count integer NOT NULL DEFAULT 0,
  last_active_date date NOT NULL DEFAULT CURRENT_DATE,
  longest_streak integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.daily_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak" ON public.daily_streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streak" ON public.daily_streaks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streak" ON public.daily_streaks FOR UPDATE TO authenticated USING (auth.uid() = user_id);