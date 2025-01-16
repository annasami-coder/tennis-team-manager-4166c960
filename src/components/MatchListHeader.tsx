import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MatchListHeaderProps {
  showPastMatches: boolean;
  onTogglePastMatches: () => void;
}

export const MatchListHeader = ({ 
  showPastMatches, 
  onTogglePastMatches 
}: MatchListHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-tennis-blue">
          {showPastMatches ? 'Past Matches' : 'Upcoming Matches'}
        </h2>
        <Button
          variant="outline"
          onClick={onTogglePastMatches}
        >
          {showPastMatches ? 'Show Upcoming' : 'Show Past Matches'}
        </Button>
      </div>
      <Link to="/availability">
        <Button variant="outline">View Availability</Button>
      </Link>
    </div>
  );
};