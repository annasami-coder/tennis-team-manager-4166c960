import { Player } from '@/types/match';

interface AvailabilityCountsProps {
  matchId: string;
  players: Player[];
  availabilities: Record<string, Record<string, string>>;
}

export const AvailabilityCounts = ({ matchId, players, availabilities }: AvailabilityCountsProps) => {
  const counts = {
    available: 0,
    not_available: 0,
    tentative: 0,
    not_selected: 0
  };

  players.forEach(player => {
    const status = availabilities[matchId]?.[player.id];
    if (status === 'available') counts.available++;
    else if (status === 'not_available') counts.not_available++;
    else if (status === 'tentative') counts.tentative++;
    else counts.not_selected++;
  });

  return (
    <div className="mt-2 text-sm">
      <span className="text-green-500">Available: {counts.available}</span> •{' '}
      <span className="text-red-500">Not Available: {counts.not_available}</span> •{' '}
      <span className="text-yellow-500">Tentative: {counts.tentative}</span> •{' '}
      <span className="text-gray-500">Not Selected: {counts.not_selected}</span>
    </div>
  );
};