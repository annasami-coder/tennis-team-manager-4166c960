import { AvailabilityView } from '@/components/AvailabilityView';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Availability = () => {
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
        <AvailabilityView />
      </div>
    </div>
  );
};

export default Availability;