import { Match, Player } from '@/types/match';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface MatchCardProps {
  match: Match;
  onDelete: (id: string) => void;
}

export const MatchCard = ({ match, onDelete }: MatchCardProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [availability, setAvailability] = useState<string>("no");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*');

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error("Failed to load players");
    }
  };

  const handleAvailabilityChange = async (value: string) => {
    if (!selectedPlayer) {
      toast.error("Please select a player first");
      return;
    }

    try {
      // First, delete any existing availability record for this player and match
      await supabase
        .from('player_availability')
        .delete()
        .eq('player_id', selectedPlayer)
        .eq('match_id', match.id);

      // Then insert the new availability record
      const { error } = await supabase
        .from('player_availability')
        .insert({
          player_id: selectedPlayer,
          match_id: match.id,
          is_available: value === 'yes'
        });

      if (error) throw error;
      setAvailability(value);
      toast.success("Availability updated successfully");
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error("Failed to update availability");
    }
  };

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="font-bold text-lg">vs {match.opponent}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(match.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span>{" "}
              <span className={match.match_type === 'home' ? "text-green-600" : "text-blue-600"}>
                {match.match_type === 'home' ? "Home" : "Away"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Location:</span> {match.location}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Date:</span>{" "}
              {format(new Date(match.date_time), "PPP")}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Time:</span>{" "}
              {format(new Date(match.date_time), "p")}
            </p>
          </div>

          <div className="space-y-2">
            <Select
              value={selectedPlayer}
              onValueChange={(value) => setSelectedPlayer(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.first_name} {player.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={availability}
              onValueChange={handleAvailabilityChange}
              disabled={!selectedPlayer}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Set availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Available</SelectItem>
                <SelectItem value="no">Not Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};