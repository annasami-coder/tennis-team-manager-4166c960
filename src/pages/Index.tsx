import { useEffect, useState } from "react";
import { PlayerForm, type Player } from "@/components/PlayerForm";
import { PlayerList } from "@/components/PlayerList";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching players:", error);
        toast.error("Failed to load players");
        return;
      }

      // Map database fields to frontend model
      const mappedPlayers: Player[] = data.map(player => ({
        id: player.id,
        firstName: player.first_name,
        lastName: player.last_name,
        cellNumber: player.cell_number,
        ustaRating: player.usta_rating
      }));

      setPlayers(mappedPlayers);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load players");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlayer = async (newPlayer: Player) => {
    try {
      const { error } = await supabase
        .from("players")
        .insert({
          id: newPlayer.id,
          first_name: newPlayer.firstName,
          last_name: newPlayer.lastName,
          cell_number: newPlayer.cellNumber,
          usta_rating: newPlayer.ustaRating
        });

      if (error) {
        console.error("Error adding player:", error);
        toast.error("Failed to add player");
        return;
      }

      await fetchPlayers(); // Refresh the list
      toast.success("Player added successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add player");
    }
  };

  const handleDeletePlayer = async (id: string) => {
    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting player:", error);
        toast.error("Failed to delete player");
        return;
      }

      await fetchPlayers(); // Refresh the list
      toast.success("Player deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete player");
    }
  };

  const handleEditPlayer = async (id: string, updatedPlayer: Partial<Player>) => {
    try {
      const { error } = await supabase
        .from("players")
        .update({
          first_name: updatedPlayer.firstName,
          last_name: updatedPlayer.lastName,
          cell_number: updatedPlayer.cellNumber,
          usta_rating: updatedPlayer.ustaRating
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating player:", error);
        toast.error("Failed to update player");
        return;
      }

      await fetchPlayers(); // Refresh the list
      toast.success("Player updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update player");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading players...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PlayerForm onAddPlayer={handleAddPlayer} />
        <PlayerList
          players={players}
          onDeletePlayer={handleDeletePlayer}
          onEditPlayer={handleEditPlayer}
        />
      </div>
    </div>
  );
};

export default Index;