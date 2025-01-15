import { useEffect, useState } from 'react';
import { Match, Player, PlayerAvailability } from '@/types/match';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, MinusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AvailabilityView = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [availabilities, setAvailabilities] = useState<Record<string, Record<string, string>>>({});

  const fetchData = async () => {
    try {
      console.log('Fetching availability data...');
      
      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('date_time', { ascending: true });

      if (matchesError) throw matchesError;
      setMatches(matchesData || []);
      console.log('Fetched matches:', matchesData);

      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*');

      if (playersError) throw playersError;
      setPlayers(playersData || []);
      console.log('Fetched players:', playersData);

      // Fetch all availabilities
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('player_availability')
        .select('*');

      if (availabilityError) throw availabilityError;
      console.log('Fetched availabilities:', availabilityData);

      // Transform availability data
      const availabilityMap: Record<string, Record<string, string>> = {};
      availabilityData?.forEach((availability: PlayerAvailability) => {
        if (!availabilityMap[availability.match_id]) {
          availabilityMap[availability.match_id] = {};
        }
        availabilityMap[availability.match_id][availability.player_id] = availability.status;
      });
      setAvailabilities(availabilityMap);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to load availability data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAvailabilityIcon = (matchId: string, playerId: string) => {
    const status = availabilities[matchId]?.[playerId];
    
    switch (status) {
      case 'available':
        return <Check className="mx-auto text-green-500" />;
      case 'not_available':
        return <X className="mx-auto text-red-500" />;
      case 'tentative':
        return <MinusCircle className="mx-auto text-yellow-500" />;
      default:
        return <X className="mx-auto text-gray-300" />;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Player Availability</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match Details</TableHead>
              {players.map((player) => (
                <TableHead key={player.id} className="text-center">
                  {player.first_name} {player.last_name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">
                  <div>vs {match.opponent}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(match.date_time), "PPP")} at {format(new Date(match.date_time), "p")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {match.match_type === 'home' ? "Home" : "Away"} - {match.location}
                  </div>
                </TableCell>
                {players.map((player) => (
                  <TableCell key={player.id} className="text-center">
                    {getAvailabilityIcon(match.id, player.id)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};