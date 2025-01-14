import { useState } from 'react';
import { Player, USTARating, USTA_RATINGS } from './PlayerForm';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, X, Check } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  onDelete: (id: string) => void;
  onEdit: (id: string, updatedPlayer: Partial<Player>) => void;
}

export const PlayerCard = ({ player, onDelete, onEdit }: PlayerCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(player.firstName);
  const [editedLastName, setEditedLastName] = useState(player.lastName);
  const [editedCellNumber, setEditedCellNumber] = useState(player.cellNumber);
  const [editedRating, setEditedRating] = useState<USTARating>(player.ustaRating);

  const handleSave = () => {
    onEdit(player.id, {
      firstName: editedFirstName,
      lastName: editedLastName,
      cellNumber: editedCellNumber,
      ustaRating: editedRating
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedFirstName(player.firstName);
    setEditedLastName(player.lastName);
    setEditedCellNumber(player.cellNumber);
    setEditedRating(player.ustaRating);
    setIsEditing(false);
  };

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="font-bold text-lg">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={editedFirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
                className="w-24"
              />
              <Input
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
                className="w-24"
              />
            </div>
          ) : (
            `${player.firstName} ${player.lastName}`
          )}
        </h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="text-green-500 hover:text-green-700 hover:bg-green-50"
              >
                <Check className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(player.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Cell:</span>{" "}
            {isEditing ? (
              <Input
                value={editedCellNumber}
                onChange={(e) => setEditedCellNumber(e.target.value)}
                className="w-32 inline-block"
              />
            ) : (
              player.cellNumber
            )}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">USTA Rating:</span>{" "}
            {isEditing ? (
              <Select 
                value={editedRating} 
                onValueChange={(value: USTARating) => setEditedRating(value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  {USTA_RATINGS.map((rating) => (
                    <SelectItem key={rating} value={rating}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              player.ustaRating
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};