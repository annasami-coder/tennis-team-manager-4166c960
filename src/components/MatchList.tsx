import { useEffect, useState } from 'react';
import { Match, PlayerAvailability } from '@/types/match';
import { MatchCard } from './MatchCard';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MatchForm } from './MatchForm';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MatchListProps {
  currentPlayerId?: string;
}

export const MatchList = ({ currentPlayerId }: MatchListProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [availabilities, setAvailabilities] = useState<PlayerAvailability[]>([]);
  const [matchToEdit, setMatchToEdit] = useState<Match | undefined>();

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

  const handleEditMatch = (match: Match) => {
    setMatchToEdit(match);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-tennis-blue">Upcoming Matches</h2>
        <Link to="/availability">
          <Button variant="outline">View Availability</Button>
        </Link>
      </div>

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

      {matches.length > 0 ? (
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {matches.map((match) => (
                <CarouselItem key={match.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <MatchCard
                    match={match}
                    onDelete={handleDeleteMatch}
                    onEdit={handleEditMatch}
                    playerId={currentPlayerId}
                    availabilityStatus={availabilities.find(a => a.match_id === match.id)?.status || 'not_available'}
                    onAvailabilityChange={fetchAvailabilities}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No matches scheduled yet. Add your first match above!
        </div>
      )}
    </div>
  );
};