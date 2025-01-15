import { useEffect, useState } from "react";
import { PlayerForm, type Player } from "@/components/PlayerForm";
import { PlayerList } from "@/components/PlayerList";
import { MatchForm } from "@/components/MatchForm";
import { MatchList } from "@/components/MatchList";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);
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
    } finally {
      setIsLoading(false);
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
      setShowPlayerForm(false); // Hide form after successful addition
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

  const handleAddMatch = () => {
    setShowMatchForm(false); // Hide form after match is added
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading players...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-tennis-blue">Match Management</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Select Player</h2>
            <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a player" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.firstName} {player.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={() => setShowMatchForm(!showMatchForm)} 
            className="mb-4"
          >
            {showMatchForm ? "Cancel" : "Add New Match"}
          </Button>

          {showMatchForm && <MatchForm onAddMatch={handleAddMatch} />}
          <MatchList currentPlayerId={selectedPlayerId} />
        </div>

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
            onEditPlayer={handleEditPlayer}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;