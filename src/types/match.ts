export interface Match {
  id: string;
  opponent: string;
  isHome: boolean;
  location: string;
  dateTime: string;
  availablePlayers: string[]; // Array of player IDs
}