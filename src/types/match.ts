import { Database } from '@/integrations/supabase/types';

export type Match = {
  id: string;
  opponent: string;
  match_type: 'home' | 'away';
  location: string;
  date_time: string;
  created_at?: string;
};

export type PlayerAvailability = {
  id: string;
  player_id: string;
  match_id: string;
  status: 'available' | 'not_available' | 'tentative';
  created_at?: string;
};

export type Player = {
  id: string;
  first_name: string;
  last_name: string;
  cell_number: string;
  usta_rating: Database['public']['Enums']['usta_rating'];
  created_at?: string;
};