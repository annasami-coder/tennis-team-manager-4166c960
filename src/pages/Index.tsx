import { useState, useEffect } from 'react';
import { PlayerForm, type Player } from '@/components/PlayerForm';
import { PlayerList } from '@/components/PlayerList';
import { MatchForm } from '@/components/MatchForm';
import { MatchList } from '@/components/MatchList';
import { Match } from '@/types/match';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Index = () => {
  // Initialize state with data from localStorage if it exists
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const savedMatches = localStorage.getItem('matches');
    return savedMatches ? JSON.parse(savedMatches) : [];
  });

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(() => {
    const savedPlayerId = localStorage.getItem('selectedPlayerId');
    return savedPlayerId || '';
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('selectedPlayerId', selectedPlayerId);
  }, [selectedPlayerId]);

  const handleAddPlayer = (newPlayer: Player) => {
    if (players.length >= 25) {
      toast.error("Maximum team size (25) reached!");
      return;
    }
    setPlayers([...players, newPlayer]);
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
    if (selectedPlayerId === id) {
      setSelectedPlayerId('');
    }
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
    
    const isNowAvailable = matches
      .find(m => m.id === matchId)
      ?.availablePlayers.includes(playerId) === false;
    
    toast.success(
      isNowAvailable 
        ? "You're now marked as available for this match" 
        : "You're now marked as unavailable for this match"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-tennis-blue text-center mb-8">
          Tennis Team Manager
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Your Player Profile</h2>
          <Select
            value={selectedPlayerId}
            onValueChange={setSelectedPlayerId}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select your player profile" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  {`${player.firstName} ${player.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
              currentPlayerId={selectedPlayerId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;