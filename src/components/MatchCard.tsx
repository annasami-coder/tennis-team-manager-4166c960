import { Match } from '@/types/match';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MatchCardProps {
  match: Match;
  onDelete: (id: string) => void;
  onEdit: (match: Match) => void;
  playerId?: string;
  isAvailable?: boolean;
  onAvailabilityChange?: () => void;
}

export const MatchCard = ({ match, onDelete, onEdit, playerId, isAvailable, onAvailabilityChange }: MatchCardProps) => {
  const handleAvailabilityChange = async (value: string) => {
    if (!playerId) {
      toast.error("Please select a player first");
      return;
    }

    try {
      // First, delete any existing availability record for this player and match
      await supabase
        .from('player_availability')
        .delete()
        .eq('player_id', playerId)
        .eq('match_id', match.id);

      // Then insert the new availability record
      const { error } = await supabase
        .from('player_availability')
        .insert({
          player_id: playerId,
          match_id: match.id,
          is_available: value === 'yes'
        });

      if (error) throw error;
      toast.success("Availability updated successfully");
      if (onAvailabilityChange) {
        onAvailabilityChange();
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error("Failed to update availability");
    }
  };

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="font-bold text-lg">vs {match.opponent}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(match)}
            className="text-tennis-blue hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(match.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
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

          {playerId && (
            <div className="space-y-2">
              <Select
                value={isAvailable ? "yes" : "no"}
                onValueChange={handleAvailabilityChange}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};