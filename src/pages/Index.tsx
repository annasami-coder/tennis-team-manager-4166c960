import { useState } from 'react';
import { PlayerForm, type Player } from '@/components/PlayerForm';
import { PlayerList } from '@/components/PlayerList';
import { toast } from "sonner";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-tennis-blue text-center mb-8">
          Tennis Team Manager
        </h1>
        <PlayerForm onAddPlayer={handleAddPlayer} />
        <PlayerList players={players} onDeletePlayer={handleDeletePlayer} />
      </div>
    </div>
  );
};

export default Index;