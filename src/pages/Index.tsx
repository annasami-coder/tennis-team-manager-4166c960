import { useState } from 'react';
import { PlayerForm, type Player } from '@/components/PlayerForm';
import { PlayerList } from '@/components/PlayerList';
import { toast } from "sonner";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers([newPlayer, ...players]);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-tennis-blue mb-8">
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
        </div>
      </div>
    </div>
  );
};

export default Index;