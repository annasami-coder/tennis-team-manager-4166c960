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
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AvailabilityView = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [availabilities, setAvailabilities] = useState<Record<string, string[]>>({});

  const fetchData = async () => {
    try {
      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('date_time', { ascending: true });

      if (matchesError) throw matchesError;
      setMatches(matchesData || []);

      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*');

      if (playersError) throw playersError;
      setPlayers(playersData || []);

      // Fetch all availabilities
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('player_availability')
        .select('*')
        .eq('is_available', true);

      if (availabilityError) throw availabilityError;

      // Transform availability data
      const availabilityMap: Record<string, string[]> = {};
      availabilityData?.forEach((availability: PlayerAvailability) => {
        if (!availabilityMap[availability.match_id]) {
          availabilityMap[availability.match_id] = [];
        }
        availabilityMap[availability.match_id].push(availability.player_id);
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
                    {availabilities[match.id]?.includes(player.id) ? (
                      <Check className="mx-auto text-green-500" />
                    ) : (
                      <X className="mx-auto text-red-500" />
                    )}
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