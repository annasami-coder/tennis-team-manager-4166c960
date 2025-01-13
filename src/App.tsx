import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Availability from "@/pages/Availability";

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/auth" 
          element={session ? <Navigate to="/" /> : <Auth />} 
        />
        <Route 
          path="/" 
          element={session ? <Index /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/availability" 
          element={session ? <Availability /> : <Navigate to="/auth" />} 
        />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;