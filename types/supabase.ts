export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string
          is_admin?: boolean
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
        }
        Insert: {
          name: string
          description?: string | null
        }
        Update: {
          name?: string
          description?: string | null
        }
      }
      preambles: {
        Row: {
          id: number
          text: string
          category_id: number
        }
        Insert: {
          text: string
          category_id: number
        }
        Update: {
          text?: string
          category_id?: number
        }
      }
      questions: {
        Row: {
          id: number
          text: string
          category_id: number
          is_active: boolean
        }
        Insert: {
          text: string
          category_id: number
          is_active?: boolean
        }
        Update: {
          text?: string
          category_id?: number
          is_active?: boolean
        }
      }
      assessments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          status: 'draft' | 'completed'
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          status?: 'draft' | 'completed'
        }
        Update: {
          title?: string
          status?: 'draft' | 'completed'
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          assessment_id: string
          question_id: number
          value: number
          text: string | null
          category: string
        }
        Insert: {
          assessment_id: string
          question_id: number
          value: number
          text?: string | null
          category: string
        }
        Update: {
          value?: number
          text?: string | null
          category?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: number
          user_id: string
          assessment_id: string
          generated_at: string
          file_url: string
        }
        Insert: {
          user_id: string
          assessment_id: string
          file_url: string
        }
        Update: {
          file_url?: string
        }
      }
      purchases: {
        Row: {
          id: number
          user_id: string
          product_id: number
          purchase_date: string
          status: 'pending' | 'completed' | 'failed'
          amount: number
        }
        Insert: {
          user_id: string
          product_id: number
          status?: 'pending' | 'completed' | 'failed'
          amount: number
        }
        Update: {
          status?: 'pending' | 'completed' | 'failed'
          amount?: number
        }
      }
    }
  }
} 