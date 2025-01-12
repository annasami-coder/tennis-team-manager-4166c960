import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const USTA_RATINGS = [
  "2.5C", "2.5S", "2.5A", "3.0C", "3.0S", "3.0A", 
  "3.5C", "3.5S", "3.5A", "4.0S", "4.0A", "4.0C", 
  "4.5S", "4.5A", "4.5C", "5.0C", "5.0A", "5.0S"
];

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  cellNumber: string;
  ustaRating: string;
}

interface PlayerFormProps {
  onAddPlayer: (player: Player) => void;
}

const formatPhoneNumber = (value: string) => {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/\D/g, '');
  
  // Format to XXX-XXX-XXXX
  if (phoneNumber.length >= 10) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
  
  return phoneNumber;
};

export const PlayerForm = ({ onAddPlayer }: PlayerFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cellNumber, setCellNumber] = useState("");
  const [ustaRating, setUstaRating] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setCellNumber(formattedNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !cellNumber || !ustaRating) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate phone number format
    if (cellNumber.replace(/\D/g, '').length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      cellNumber: formatPhoneNumber(cellNumber), // Ensure consistent format
      ustaRating
    };

    onAddPlayer(newPlayer);
    toast.success("Player added successfully!");
    
    // Reset form
    setFirstName("");
    setLastName("");
    setCellNumber("");
    setUstaRating("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-tennis-blue mb-6">Add New Player</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">First Name</label>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Last Name</label>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cell Number</label>
        <Input
          value={cellNumber}
          onChange={handlePhoneChange}
          placeholder="XXX-XXX-XXXX"
          type="tel"
          className="w-full"
          maxLength={12}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">USTA Rating</label>
        <Select value={ustaRating} onValueChange={setUstaRating}>
          <SelectTrigger>
            <SelectValue placeholder="Select Rating" />
          </SelectTrigger>
          <SelectContent>
            {USTA_RATINGS.map((rating) => (
              <SelectItem key={rating} value={rating}>
                {rating}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full bg-tennis-blue hover:bg-blue-700 text-white">
        Add Player
      </Button>
    </form>
  );
};