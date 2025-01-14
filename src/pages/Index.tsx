import { useState, useEffect } from 'react';
import { PlayerForm, type Player } from '@/components/PlayerForm';
import { PlayerList } from '@/components/PlayerList';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedPlayers: Player[] = data.map(player => ({
          id: player.id.toString(),
          firstName: player.first_name,
          lastName: player.last_name,
          cellNumber: player.cell_number,
          ustaRating: player.rating
        }));
        setPlayers(formattedPlayers);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error("Failed to load players. Please refresh the page.");
    }
  };

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers([newPlayer, ...players]);
  };

  const handleDeletePlayer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;

      setPlayers(players.filter(player => player.id !== id));
      toast.success("Player removed successfully!");
    } catch (error) {
      console.error('Error deleting player:', error);
      toast.error("Failed to delete player. Please try again.");
    }
  };

  const handleEditPlayer = async (id: string, updatedPlayer: Partial<Player>) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({
          first_name: updatedPlayer.firstName,
          last_name: updatedPlayer.lastName,
          cell_number: updatedPlayer.cellNumber,
          rating: updatedPlayer.ustaRating
        })
        .eq('id', parseInt(id));

      if (error) throw error;

      setPlayers(players.map(player => 
        player.id === id ? { ...player, ...updatedPlayer } : player
      ));
      toast.success("Player updated successfully!");
    } catch (error) {
      console.error('Error updating player:', error);
      toast.error("Failed to update player. Please try again.");
    }
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