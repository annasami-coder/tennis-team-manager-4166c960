import { useState, useEffect } from 'react';
import { AvailabilityView } from '@/components/AvailabilityView';
import { Match } from '@/types/match';
import { Player } from '@/components/PlayerForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Availability = () => {
  const [matches, setMatches] = useState<Match[]>(() => {
    const savedMatches = localStorage.getItem('matches');
    return savedMatches ? JSON.parse(savedMatches) : [];
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-tennis-blue">
            Match Availability Overview
          </h1>
          <Button asChild>
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
        <AvailabilityView matches={matches} players={players} />
      </div>
    </div>
  );
};

export default Availability;