import { Player } from './PlayerForm';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  onDelete: (id: string) => void;
}

export const PlayerCard = ({ player, onDelete }: PlayerCardProps) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="font-bold text-lg">
          {player.firstName} {player.lastName}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(player.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Rating:</span>{" "}
            <span className="bg-tennis-yellow px-2 py-1 rounded text-black">
              {player.ustaRating}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Cell:</span> {player.cellNumber}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};