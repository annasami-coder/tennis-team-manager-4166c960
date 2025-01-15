import { useState } from 'react';
import { Match } from '@/types/match';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface MatchFormProps {
  onAddMatch: () => void;
}

export const MatchForm = ({ onAddMatch }: MatchFormProps) => {
  const [opponent, setOpponent] = useState("");
  const [isHome, setIsHome] = useState(true);
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!opponent || !location || !dateTime) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('matches')
        .insert({
          opponent,
          match_type: isHome ? 'home' : 'away',
          location,
          date_time: dateTime
        });

      if (error) throw error;

      toast.success("Match added successfully!");
      onAddMatch();
      
      // Reset form
      setOpponent("");
      setLocation("");
      setDateTime("");
      setIsHome(true);
    } catch (error) {
      console.error('Error adding match:', error);
      toast.error("Failed to add match");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-tennis-blue mb-6">Add New Match</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Opponent Team</label>
        <Input
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          placeholder="Opponent Team Name"
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="home-away"
          checked={isHome}
          onCheckedChange={setIsHome}
        />
        <Label htmlFor="home-away">Home Match</Label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Match Location"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date and Time</label>
        <Input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full"
        />
      </div>

      <Button type="submit" className="w-full bg-tennis-blue hover:bg-blue-700 text-white">
        Add Match
      </Button>
    </form>
  );
};