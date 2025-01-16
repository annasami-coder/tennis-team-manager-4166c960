import { Check, X, MinusCircle } from "lucide-react";
import { TableCell } from "@/components/ui/table";

interface AvailabilityIconProps {
  status: string;
}

export const AvailabilityIcon = ({ status }: AvailabilityIconProps) => {
  switch (status) {
    case 'available':
      return <Check className="mx-auto text-green-500" />;
    case 'not_available':
      return <X className="mx-auto text-red-500" />;
    case 'tentative':
      return <MinusCircle className="mx-auto text-yellow-500" />;
    default:
      return <X className="mx-auto text-gray-300" />;
  }
};