import { useState } from "react";
import { MatchForm } from "@/components/MatchForm";
import { MatchList } from "@/components/MatchList";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Player } from "@/components/PlayerForm";

interface MatchManagementProps {
  players: Player[];
}

export const MatchManagement = ({ players }: MatchManagementProps) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [showMatchForm, setShowMatchForm] = useState(false);

  const handleAddMatch = () => {
    setShowMatchForm(false);
  };

  return (
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
  );
};