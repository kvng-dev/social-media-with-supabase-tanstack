import { createClient } from "@supabase/supabase-js";

console.log(import.meta.env.SUPABASE_KEY);
const supabaseUrl = "https://kjluyenlftequysaoxzz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbHV5ZW5sZnRlcXV5c2FveHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NTA3MTQsImV4cCI6MjA1NzIyNjcxNH0.V0_kX8MwVCPWS5r9ZRiUe8tzqnCEFTGNxqKY6oR5iB0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
