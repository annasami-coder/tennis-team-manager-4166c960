import { Match } from '@/types/match';
import { MatchCard } from './MatchCard';

interface MatchListProps {
  matches: Match[];
  onDeleteMatch: (id: string) => void;
  onToggleAvailability: (matchId: string, playerId: string) => void;
  currentPlayerId?: string;
}

export const MatchList = ({ matches, onDeleteMatch, onToggleAvailability, currentPlayerId }: MatchListProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-tennis-blue mb-6">Upcoming Matches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <MatchCard 
            key={match.id} 
            match={match} 
            onDelete={onDeleteMatch}
            onToggleAvailability={onToggleAvailability}
            currentPlayerId={currentPlayerId}
          />
        ))}
      </div>
      {matches.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No matches scheduled yet. Add your first match above!
        </div>
      )}
    </div>
  );
};