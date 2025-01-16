import { useEffect, useState } from 'react';
import { Match, PlayerAvailability } from '@/types/match';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MatchForm } from './MatchForm';
import { MatchListHeader } from './MatchListHeader';
import { MatchCarousel } from './MatchCarousel';

interface MatchListProps {
  currentPlayerId?: string;
}

export const MatchList = ({ currentPlayerId }: MatchListProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [availabilities, setAvailabilities] = useState<PlayerAvailability[]>([]);
  const [matchToEdit, setMatchToEdit] = useState<Match | undefined>();
  const [showPastMatches, setShowPastMatches] = useState(false);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('date_time', { ascending: true });

      if (error) throw error;
      console.log('Fetched matches:', data);
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error("Failed to load matches");
    }
  };

  const fetchAvailabilities = async () => {
    if (!currentPlayerId) return;

    try {
      const { data, error } = await supabase
        .from('player_availability')
        .select('*')
        .eq('player_id', currentPlayerId);

      if (error) throw error;
      setAvailabilities(data || []);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      toast.error("Failed to load availabilities");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (currentPlayerId) {
      fetchAvailabilities();
    }
  }, [currentPlayerId]);

  const handleDeleteMatch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Match deleted successfully");
      fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error("Failed to delete match");
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchDate = new Date(match.date_time);
    const now = new Date();
    return showPastMatches ? matchDate < now : matchDate >= now;
  });

  return (
    <div className="mt-8">
      <MatchListHeader 
        showPastMatches={showPastMatches}
        onTogglePastMatches={() => setShowPastMatches(!showPastMatches)}
      />

      {matchToEdit && (
        <div className="mb-6">
          <MatchForm 
            matchToEdit={matchToEdit} 
            onAddMatch={() => {
              setMatchToEdit(undefined);
              fetchMatches();
            }}
            onCancel={() => setMatchToEdit(undefined)}
          />
        </div>
      )}

      {filteredMatches.length > 0 ? (
        <MatchCarousel
          matches={filteredMatches}
          onDelete={handleDeleteMatch}
          onEdit={setMatchToEdit}
          playerId={currentPlayerId}
          availabilities={availabilities}
          onAvailabilityChange={fetchAvailabilities}
        />
      ) : (
        <div className="text-center text-gray-500 py-8">
          {showPastMatches 
            ? "No past matches found."
            : "No upcoming matches scheduled yet. Add your first match above!"}
        </div>
      )}
    </div>
  );
};