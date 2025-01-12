import { useState } from 'react';
import { PlayerForm, type Player } from '@/components/PlayerForm';
import { PlayerList } from '@/components/PlayerList';
import { MatchForm } from '@/components/MatchForm';
import { MatchList } from '@/components/MatchList';
import { Match } from '@/types/match';
import { toast } from "sonner";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const handleAddPlayer = (newPlayer: Player) => {
    if (players.length >= 25) {
      toast.error("Maximum team size (25) reached!");
      return;
    }
    setPlayers([...players, newPlayer]);
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
    toast.success("Player removed successfully!");
  };

  const handleEditPlayer = (id: string, updatedPlayer: Partial<Player>) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, ...updatedPlayer } : player
    ));
    toast.success("Player updated successfully!");
  };

  const handleAddMatch = (newMatch: Match) => {
    setMatches([...matches, newMatch]);
  };

  const handleDeleteMatch = (id: string) => {
    setMatches(matches.filter(match => match.id !== id));
    toast.success("Match removed successfully!");
  };

  const handleToggleAvailability = (matchId: string, playerId: string) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        const availablePlayers = match.availablePlayers.includes(playerId)
          ? match.availablePlayers.filter(id => id !== playerId)
          : [...match.availablePlayers, playerId];
        return { ...match, availablePlayers };
      }
      return match;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-tennis-blue text-center mb-8">
          Tennis Team Manager
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <PlayerForm onAddPlayer={handleAddPlayer} />
            <PlayerList 
              players={players} 
              onDeletePlayer={handleDeletePlayer}
              onEditPlayer={handleEditPlayer}
            />
          </div>
          
          <div>
            <MatchForm onAddMatch={handleAddMatch} />
            <MatchList 
              matches={matches}
              onDeleteMatch={handleDeleteMatch}
              onToggleAvailability={handleToggleAvailability}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;