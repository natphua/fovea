import { GazePoint, FocusMetrics } from '../focus/session'

export interface Database {
  public: {
    Tables: {
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string
          gaze_data: GazePoint[]
          metrics: FocusMetrics
          file_protocol?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time: string
          gaze_data: GazePoint[]
          metrics: FocusMetrics
          file_protocol?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string
          gaze_data?: GazePoint[]
          metrics?: FocusMetrics
          file_protocol?: string
          created_at?: string
        }
      }
      prev_files: {
        Row: {
          id: string
          user_id: string
          file_protocol: string
          file_name: string
          last_accessed: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_protocol: string
          file_name: string
          last_accessed?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_protocol?: string
          file_name?: string
          last_accessed?: string
          created_at?: string
        }
      }
    }
  }
}
