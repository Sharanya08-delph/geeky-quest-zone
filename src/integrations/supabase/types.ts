export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          department: string | null
          year: string | null
          register_number: string | null
          points: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          department: string | null
          year: string | null
          register_number: string | null
          points: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Update: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          department: string | null
          year: string | null
          register_number: string | null
          points: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string | null
          venue: string | null
          type: string
          status: string
          max_participants: number | null
          created_by: string | null
          registration_count?: number
        }
        Insert: {
          title: string
          description: string | null
          date: string
          time: string | null
          venue: string | null
          type: string
          status: string
          max_participants: number | null
          created_by: string | null
        }
        Update: {
          title: string
          description: string | null
          date: string
          time: string | null
          venue: string | null
          type: string
          status: string
          max_participants: number | null
          created_by: string | null
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          priority: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          title: string
          content: string
          priority: string
          created_by: string | null
        }
        Update: {
          title: string
          content: string
          priority: string
          created_by: string | null
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          type: string
          url: string
          description: string
          category: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          title: string
          type: string
          url: string
          description: string
          category: string
          created_by: string | null
        }
        Update: {
          title: string
          type: string
          url: string
          description: string
          category: string
          created_by: string | null
        }
      }
      problems: {
        Row: {
          id: string
          title: string
          description: string
          difficulty: string
          category: string
          created_at: string
        }
        Insert: {
          title: string
          description: string
          difficulty: string
          category: string
        }
        Update: {
          title: string
          description: string
          difficulty: string
          category: string
        }
      }
      forum_posts: {
        Row: {
          id: string
          title: string
          content: string
          user_id: string
          created_at: string
        }
        Insert: {
          title: string
          content: string
          user_id: string
        }
        Update: {
          title: string
          content: string
          user_id: string
        }
      }
      forum_replies: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          post_id: string
          user_id: string
          content: string
        }
        Update: {
          post_id: string
          user_id: string
          content: string
        }
      }
      peer_challenges: {
        Row: {
          id: string
          challenger_id: string
          challenged_id: string
          problem_id: string
          bet_amount: number
          status: string
          created_at: string
          challenger_name?: string
          challenged_name?: string
          problem_title?: string
        }
        Insert: {
          challenger_id: string
          challenged_id: string
          problem_id: string
          bet_amount: number
          status: string
        }
        Update: {
          challenger_id: string
          challenged_id: string
          problem_id: string
          bet_amount: number
          status: string
        }
      }
      problem_submissions: {
        Row: {
          id: string
          problem_id: string
          user_id: string
          code: string
          language: string
          status: string
          points_earned: number
          created_at: string
        }
        Insert: {
          problem_id: string
          user_id: string
          code: string
          language: string
          status: string
          points_earned: number
        }
        Update: {
          problem_id: string
          user_id: string
          code: string
          language: string
          status: string
          points_earned: number
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          name: string
          email: string
          department: string | null
          year: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          event_id: string
          user_id: string
          name: string
          email: string
          department: string | null
          year: string | null
          phone: string | null
        }
        Update: {
          event_id: string
          user_id: string
          name: string
          email: string
          department: string | null
          year: string | null
          phone: string | null
        }
      }
      daily_streaks: {
        Row: {
          id: string
          user_id: string
          streak_count: number
          longest_streak: number
          last_active_date: string
        }
        Insert: {
          user_id: string
          streak_count: number
          longest_streak: number
          last_active_date: string
        }
        Update: {
          user_id: string
          streak_count: number
          longest_streak: number
          last_active_date: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
