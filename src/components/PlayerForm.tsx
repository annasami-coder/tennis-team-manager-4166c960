import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const phoneNumber = value.replace(/\D/g, '');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !cellNumber || !ustaRating) {
      toast.error("Please fill in all fields");
      return;
    }

    if (cellNumber.replace(/\D/g, '').length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('players')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            cell_number: formatPhoneNumber(cellNumber),
            rating: ustaRating
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newPlayer: Player = {
          id: data.id.toString(),
          firstName: data.first_name,
          lastName: data.last_name,
          cellNumber: data.cell_number,
          ustaRating: data.rating
        };

        onAddPlayer(newPlayer);
        toast.success("Player added successfully!");
        
        // Reset form
        setFirstName("");
        setLastName("");
        setCellNumber("");
        setUstaRating("");
      }
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error("Failed to add player. Please try again.");
    }
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