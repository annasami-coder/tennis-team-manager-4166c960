// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jlwgnfqjzbfadbtpbncq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impsd2duZnFqemJmYWRidHBibmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0ODIzOTgsImV4cCI6MjA1MjA1ODM5OH0.bUDqdnpqZ6cnAi-mR2VSg0BjrItLBNdvESSP85boMlA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);