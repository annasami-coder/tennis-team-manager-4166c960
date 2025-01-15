import { useState } from 'react';
import { Player } from './PlayerForm';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type USTARating = Database["public"]["Enums"]["usta_rating"];

interface PlayerCardProps {
  player: Player;
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedPlayer: Partial<Player>) => void;
}

const USTA_RATINGS: USTARating[] = [
  "2.5C", "3.0S", "3.0A", "3.0C", "3.5S", "3.5A", 
  "3.5C", "4.0S", "4.0A", "4.0C", "4.5A", "4.5C", "4.5S"
];

export const PlayerCard = ({ player, onDelete, onEdit }: PlayerCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(player.firstName);
  const [editedLastName, setEditedLastName] = useState(player.lastName);
  const [editedCellNumber, setEditedCellNumber] = useState(player.cellNumber);
  const [editedUstaRating, setEditedUstaRating] = useState<USTARating>(player.ustaRating as USTARating);

  const handleSave = () => {
    onEdit(player.id, {
      firstName: editedFirstName,
      lastName: editedLastName,
      cellNumber: editedCellNumber,
      ustaRating: editedUstaRating
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedFirstName(player.firstName);
    setEditedLastName(player.lastName);
    setEditedCellNumber(player.cellNumber);
    setEditedUstaRating(player.ustaRating as USTARating);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-2 w-full">
            <Input
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              placeholder="First Name"
            />
            <Input
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={editedCellNumber}
            onChange={(e) => setEditedCellNumber(e.target.value)}
            placeholder="Cell Number"
            type="tel"
          />
          <Select 
            value={editedUstaRating} 
            onValueChange={(value: USTARating) => setEditedUstaRating(value)}
          >
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
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="text-green-500 hover:text-green-700 hover:bg-green-50"
            >
              <Check className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="font-bold text-lg">
          {player.firstName} {player.lastName}
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(player.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Rating:</span>{" "}
            <span className="bg-tennis-yellow px-2 py-1 rounded text-black">
              {player.ustaRating}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Cell:</span> {player.cellNumber}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};