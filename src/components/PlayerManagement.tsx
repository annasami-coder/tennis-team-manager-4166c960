import { useState, useEffect } from "react";
import { PlayerForm, type Player } from "@/components/PlayerForm";
import { PlayerList } from "@/components/PlayerList";
import { Button } from "@/components/ui/button";
import { usePlayerOperations } from "@/hooks/usePlayerOperations";

export const PlayerManagement = () => {
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const { players, fetchPlayers, addPlayer, deletePlayer, editPlayer } = usePlayerOperations();

  useEffect(() => {
    console.log("Fetching players on mount");
    fetchPlayers();
  }, []);

  const handleAddPlayer = async (newPlayer: Player) => {
    const success = await addPlayer(newPlayer);
    if (success) {
      setShowPlayerForm(false);
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
        onDeletePlayer={deletePlayer}
        onEditPlayer={editPlayer}
      />
    </div>
  );
};