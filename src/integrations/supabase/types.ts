export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      matches: {
        Row: {
          created_at: string
          date_time: string
          id: string
          location: string
          match_type: Database["public"]["Enums"]["match_type"]
          opponent: string
        }
        Insert: {
          created_at?: string
          date_time: string
          id?: string
          location: string
          match_type: Database["public"]["Enums"]["match_type"]
          opponent: string
        }
        Update: {
          created_at?: string
          date_time?: string
          id?: string
          location?: string
          match_type?: Database["public"]["Enums"]["match_type"]
          opponent?: string
        }
        Relationships: []
      }
      player_availability: {
        Row: {
          created_at: string
          id: string
          match_id: string
          player_id: string
          status: Database["public"]["Enums"]["availability_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          player_id: string
          status: Database["public"]["Enums"]["availability_status"]
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          player_id?: string
          status?: Database["public"]["Enums"]["availability_status"]
        }
        Relationships: [
          {
            foreignKeyName: "player_availability_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_availability_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          cell_number: string
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["team_role"]
          sex: string
          team_id: string | null
          usta_rating: Database["public"]["Enums"]["usta_rating"]
        }
        Insert: {
          cell_number: string
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          role?: Database["public"]["Enums"]["team_role"]
          sex?: string
          team_id?: string | null
          usta_rating: Database["public"]["Enums"]["usta_rating"]
        }
        Update: {
          cell_number?: string
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["team_role"]
          sex?: string
          team_id?: string | null
          usta_rating?: Database["public"]["Enums"]["usta_rating"]
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cell_number: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          rating: string | null
        }
        Insert: {
          cell_number?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          rating?: string | null
        }
        Update: {
          cell_number?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          rating?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      availability_status: "available" | "not_available" | "tentative"
      league_enum: "league A" | "league B"
      leagues_enum:
        | "Baytrees Adult League 40+ 4.0"
        | "Baytrees Adult League 18+ 4.0"
      match_type: "home" | "away"
      rating_enum:
        | "2.5A"
        | "2.5C"
        | "3.0A"
        | "3.0C"
        | "3.5A"
        | "3.5C"
        | "4.0A"
        | "4.0C"
        | "4.5A"
        | "4.5C"
        | "5.0A"
        | "5.0C"
      team_role: "captain" | "co_captain" | "player"
      usta_rating:
        | "2.5C"
        | "3.0S"
        | "3.0A"
        | "3.0C"
        | "3.5S"
        | "3.5A"
        | "3.5C"
        | "4.0S"
        | "4.0A"
        | "4.0C"
        | "4.5A"
        | "4.5C"
        | "4.5S"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
