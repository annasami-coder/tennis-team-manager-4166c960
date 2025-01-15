import { useEffect, useState } from 'react';
import { Match, PlayerAvailability } from '@/types/match';
import { MatchCard } from './MatchCard';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

interface MatchListProps {
  currentPlayerId?: string;
  limit?: number;
}

export const MatchList = ({ currentPlayerId, limit = 3 }: MatchListProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [availabilities, setAvailabilities] = useState<PlayerAvailability[]>([]);
  const [showAll, setShowAll] = useState(false);

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

  const displayedMatches = showAll ? matches : matches.slice(0, limit);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-tennis-blue">Upcoming Matches</h2>
        <Link to="/availability">
          <Button variant="outline">View Availability</Button>
        </Link>
      </div>
      <ScrollArea className="h-[500px] w-full rounded-md border">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onDelete={handleDeleteMatch}
                playerId={currentPlayerId}
                isAvailable={availabilities.some(a => a.match_id === match.id && a.is_available)}
                onAvailabilityChange={fetchAvailabilities}
              />
            ))}
          </div>
          {matches.length > limit && (
            <Button 
              onClick={() => setShowAll(!showAll)} 
              className="mt-4 w-full flex items-center justify-center gap-2"
              variant="outline"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show {matches.length - limit} More Matches <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </ScrollArea>
      {matches.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No matches scheduled yet. Add your first match above!
        </div>
      )}
    </div>
  );
};