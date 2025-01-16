import { Match, PlayerAvailability } from '@/types/match';
import { MatchCard } from './MatchCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MatchCarouselProps {
  matches: Match[];
  onDelete: (id: string) => void;
  onEdit: (match: Match) => void;
  playerId?: string;
  availabilities: PlayerAvailability[];
  onAvailabilityChange: () => void;
}

export const MatchCarousel = ({
  matches,
  onDelete,
  onEdit,
  playerId,
  availabilities,
  onAvailabilityChange
}: MatchCarouselProps) => {
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {matches.map((match) => (
            <CarouselItem key={match.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <MatchCard
                match={match}
                onDelete={onDelete}
                onEdit={onEdit}
                playerId={playerId}
                availabilityStatus={availabilities.find(a => a.match_id === match.id)?.status}
                onAvailabilityChange={onAvailabilityChange}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};