import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://fjnwxeypsiddrrssyeff.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqbnd4ZXlwc2lkZHJyc3N5ZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Njc1MzksImV4cCI6MjA4NjE0MzUzOX0.PSXBa0oTd1P9NneFTXgaFlbx6CD9keh_EIef1cTH2SA"
);
