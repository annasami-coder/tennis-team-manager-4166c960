import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Team } from "@/integrations/supabase/types";

export const TeamNameForm = () => {
  const [teamName, setTeamName] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentTeam();
  }, []);

  const fetchCurrentTeam = async () => {
    try {
      console.log("Fetching current team");
      const { data: teams, error } = await supabase
        .from("teams")
        .select("*")
        .limit(1);

      if (error) throw error;

      if (teams && teams.length > 0) {
        setTeamName(teams[0].name);
        setCurrentTeamId(teams[0].id);
      }
    } catch (error) {
      console.error("Error fetching team:", error);
      toast.error("Failed to load team information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentTeamId) {
        // Update existing team
        const { error } = await supabase
          .from("teams")
          .update({ name: teamName })
          .eq("id", currentTeamId);

        if (error) throw error;
        toast.success("Team name updated successfully!");
      } else {
        // Create new team
        const { data, error } = await supabase
          .from("teams")
          .insert([{ name: teamName }])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          setCurrentTeamId(data[0].id);
        }
        toast.success("Team created successfully!");
      }
    } catch (error) {
      console.error("Error saving team:", error);
      toast.error("Failed to save team information");
    }
  };

  if (isLoading) {
    return <div>Loading team information...</div>;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
            Team Name
          </label>
          <Input
            id="teamName"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            required
            className="max-w-md"
          />
        </div>
        <Button type="submit">
          {currentTeamId ? "Update Team Name" : "Create Team"}
        </Button>
      </form>
    </div>
  );
};