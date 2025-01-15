import { useState } from "react";
import { PlayerForm, type Player } from "@/components/PlayerForm";
import { PlayerList } from "@/components/PlayerList";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [showPlayerForm, setShowPlayerForm] = useState(false);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

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
    }
  };

  const handleAddPlayer = async (newPlayer: Player) => {
    try {
      const { error } = await supabase
        .from("players")
        .insert({
          first_name: newPlayer.firstName,
          last_name: newPlayer.lastName,
          cell_number: newPlayer.cellNumber,
          usta_rating: newPlayer.ustaRating
        });

      if (error) throw error;

      await fetchPlayers();
      setShowPlayerForm(false);
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

      if (error) throw error;

      await fetchPlayers();
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

      if (error) throw error;

      await fetchPlayers();
      toast.success("Player updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update player");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-tennis-blue">Player Management</h1>
        <Button onClick={() => setShowPlayerForm(!showPlayerForm)}>
          {showPlayerForm ? "Cancel" : "Add New Player"}
        </Button>
      </div>

      {showPlayerForm && <PlayerForm onAddPlayer={handleAddPlayer} />}
      <PlayerList
        players={players}
        onDeletePlayer={handleDeletePlayer}
        onEdit={handleEditPlayer}
      />
    </div>
  );
};