import { MatchForm } from "@/components/MatchForm";
import { MatchList } from "@/components/MatchList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <MatchForm onAddMatch={() => {}} />
        <MatchList />
      </div>
    </div>
  );
};

export default Index;