import { useEffect, useState } from 'react';
import { Match, Player } from '@/types/match';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MatchDetails } from './availability/MatchDetails';
import { AvailabilityIcon } from './availability/AvailabilityIcon';

export const AvailabilityView = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [availabilities, setAvailabilities] = useState<Record<string, Record<string, string>>>({});

  const fetchData = async () => {
    try {
      console.log('Fetching availability data...');
      
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('date_time', { ascending: true });

      if (matchesError) throw matchesError;
      setMatches(matchesData || []);
      console.log('Fetched matches:', matchesData);

      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*');

      if (playersError) throw playersError;
      setPlayers(playersData || []);
      console.log('Fetched players:', playersData);

      const { data: availabilityData, error: availabilityError } = await supabase
        .from('player_availability')
        .select('*');

      if (availabilityError) throw availabilityError;
      console.log('Fetched availabilities:', availabilityData);

      const availabilityMap: Record<string, Record<string, string>> = {};
      availabilityData?.forEach((availability) => {
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
                <MatchDetails 
                  match={match}
                  players={players}
                  availabilities={availabilities}
                />
                {players.map((player) => (
                  <TableCell key={player.id} className="text-center">
                    <AvailabilityIcon status={availabilities[match.id]?.[player.id]} />
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