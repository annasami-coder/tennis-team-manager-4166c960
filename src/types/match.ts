import { Database } from '@/integrations/supabase/types';

export type Match = Database['public']['Tables']['matches']['Row'];
export type PlayerAvailability = Database['public']['Tables']['player_availability']['Row'];

export type MatchWithAvailability = Match & {
  availablePlayers: string[];
};