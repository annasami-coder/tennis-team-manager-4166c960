import { useState } from "react";
import { Player } from "@/components/PlayerForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePlayerOperations = () => {
  const [players, setPlayers] = useState<Player[]>([]);

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
        ustaRating: player.usta_rating,
        role: player.role
      }));

      setPlayers(mappedPlayers);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load players");
    }
  };

  const addPlayer = async (newPlayer: Player) => {
    try {
      const { error } = await supabase
        .from("players")
        .insert({
          first_name: newPlayer.firstName,
          last_name: newPlayer.lastName,
          cell_number: newPlayer.cellNumber,
          usta_rating: newPlayer.ustaRating,
          role: newPlayer.role
        });

      if (error) throw error;

      await fetchPlayers();
      toast.success("Player added successfully!");
      return true;
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add player");
      return false;
    }
  };

  const deletePlayer = async (id: string) => {
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

  const editPlayer = async (id: string, updatedPlayer: Partial<Player>) => {
    try {
      const { error } = await supabase
        .from("players")
        .update({
          first_name: updatedPlayer.firstName,
          last_name: updatedPlayer.lastName,
          cell_number: updatedPlayer.cellNumber,
          usta_rating: updatedPlayer.ustaRating,
          role: updatedPlayer.role
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

  return {
    players,
    fetchPlayers,
    addPlayer,
    deletePlayer,
    editPlayer
  };
};