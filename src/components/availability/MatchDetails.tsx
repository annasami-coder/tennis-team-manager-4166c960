import { format } from 'date-fns';
import { Match } from '@/types/match';
import { AvailabilityCounts } from './AvailabilityCounts';
import { TableCell } from '@/components/ui/table';

interface MatchDetailsProps {
  match: Match;
  players: any[];
  availabilities: Record<string, Record<string, string>>;
}

export const MatchDetails = ({ match, players, availabilities }: MatchDetailsProps) => {
  return (
    <TableCell className="font-medium">
      <div>vs {match.opponent}</div>
      <div className="text-sm text-muted-foreground">
        {format(new Date(match.date_time), "PPP")} at {format(new Date(match.date_time), "p")}
      </div>
      <div className="text-sm text-muted-foreground">
        {match.match_type === 'home' ? "Home" : "Away"} - {match.location}
      </div>
      <AvailabilityCounts 
        matchId={match.id}
        players={players}
        availabilities={availabilities}
      />
    </TableCell>
  );
};