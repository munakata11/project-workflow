export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          company: string
          amount_excluding_tax: number
          amount_including_tax: number
          duration: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          text: string
          completed: boolean
          percentage: number
          created_at: string
        }
      }
      sub_tasks: {
        Row: {
          id: string
          task_id: string
          text: string
          completed: boolean
          created_at: string
        }
      }
      notes: {
        Row: {
          id: string
          project_id: string
          type: string
          title: string
          content: string
          date: string
          created_at: string
        }
      }
      files: {
        Row: {
          id: string
          project_id: string
          name: string
          type: string
          url: string
          category: string
          created_at: string
        }
      }
    }
  }
}
