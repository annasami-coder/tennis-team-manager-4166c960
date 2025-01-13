import { Match } from '@/types/match';
import { Player } from '@/components/PlayerForm';
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

interface AvailabilityViewProps {
  matches: Match[];
  players: Player[];
}

export const AvailabilityView = ({ matches, players }: AvailabilityViewProps) => {
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
                  {player.firstName} {player.lastName}
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
                    {format(new Date(match.dateTime), "PPP")} at {format(new Date(match.dateTime), "p")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {match.isHome ? "Home" : "Away"} - {match.location}
                  </div>
                </TableCell>
                {players.map((player) => (
                  <TableCell key={player.id} className="text-center">
                    {match.availablePlayers.includes(player.id) ? (
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