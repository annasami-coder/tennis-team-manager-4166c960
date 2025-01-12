import { Match } from '@/types/match';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { Switch } from "@/components/ui/switch";

interface MatchCardProps {
  match: Match;
  onDelete: (id: string) => void;
  onToggleAvailability: (matchId: string, playerId: string) => void;
  currentPlayerId?: string;
}

export const MatchCard = ({ match, onDelete, onToggleAvailability, currentPlayerId }: MatchCardProps) => {
  const isAvailable = currentPlayerId && match.availablePlayers.includes(currentPlayerId);

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
            <span className={match.isHome ? "text-green-600" : "text-blue-600"}>
              {match.isHome ? "Home" : "Away"}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {match.location}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Date:</span>{" "}
            {format(new Date(match.dateTime), "PPP")}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Time:</span>{" "}
            {format(new Date(match.dateTime), "p")}
          </p>
          {currentPlayerId && (
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                checked={isAvailable}
                onCheckedChange={() => onToggleAvailability(match.id, currentPlayerId)}
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