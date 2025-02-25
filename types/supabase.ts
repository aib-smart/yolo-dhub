export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      packages: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          data: string
          validity: string
          price: number
          carrier: string
          active: boolean
          popular: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          data: string
          validity: string
          price: number
          carrier: string
          active?: boolean
          popular?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          data?: string
          validity?: string
          price?: number
          carrier?: string
          active?: boolean
          popular?: boolean | null
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          agent_id: string
          agent_name: string
          customer_phone: string
          product: string
          amount: number
          status: "pending" | "completed" | "cancelled" | "review"
          payment_method: string | null
          payment_network: string | null
          transaction_id: string | null
          sender_name: string | null
          notes: string | null
          exported: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          agent_id: string
          agent_name: string
          customer_phone: string
          product: string
          amount: number
          status?: "pending" | "completed" | "cancelled" | "review"
          payment_method?: string | null
          payment_network?: string | null
          transaction_id?: string | null
          sender_name?: string | null
          notes?: string | null
          exported?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          agent_id?: string
          agent_name?: string
          customer_phone?: string
          product?: string
          amount?: number
          status?: "pending" | "completed" | "cancelled" | "review"
          payment_method?: string | null
          payment_network?: string | null
          transaction_id?: string | null
          sender_name?: string | null
          notes?: string | null
          exported?: boolean
        }
      }
      order_timeline: {
        Row: {
          id: string
          created_at: string
          order_id: string
          status: string
          description: string
        }
        Insert: {
          id?: string
          created_at?: string
          order_id: string
          status: string
          description: string
        }
        Update: {
          id?: string
          created_at?: string
          order_id?: string
          status?: string
          description?: string
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
  }
}

