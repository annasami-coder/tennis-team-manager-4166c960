import { Player } from './PlayerForm';
import { PlayerCard } from './PlayerCard';

interface PlayerListProps {
  players: Player[];
  onDeletePlayer: (id: string) => void;
}

export const PlayerList = ({ players, onDeletePlayer }: PlayerListProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-tennis-blue mb-6">Team Roster ({players.length}/25)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} onDelete={onDeletePlayer} />
        ))}
      </div>
      {players.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No players added yet. Add your first player above!
        </div>
      )}
    </div>
  );
};