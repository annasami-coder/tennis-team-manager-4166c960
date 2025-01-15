import { Match } from '@/types/match';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MatchCardProps {
  match: Match;
  onDelete: (id: string) => void;
  playerId?: string;
  isAvailable?: boolean;
  onAvailabilityChange: () => void;
}

export const MatchCard = ({ match, onDelete, playerId, isAvailable, onAvailabilityChange }: MatchCardProps) => {
  const handleAvailabilityToggle = async () => {
    if (!playerId) return;

    try {
      if (isAvailable) {
        // Delete availability record
        const { error } = await supabase
          .from('player_availability')
          .delete()
          .eq('player_id', playerId)
          .eq('match_id', match.id);

        if (error) throw error;
      } else {
        // Insert new availability record
        const { error } = await supabase
          .from('player_availability')
          .insert({
            player_id: playerId,
            match_id: match.id,
            is_available: true
          });

        if (error) throw error;
      }

      onAvailabilityChange();
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
          {playerId && (
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                checked={isAvailable}
                onCheckedChange={handleAvailabilityToggle}
              />
              <span className="text-sm">
                {isAvailable ? "Available" : "Not Available"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};