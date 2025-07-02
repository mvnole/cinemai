// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yoshutaalkwhqrvjtihy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvc2h1dGFhbGt3aHFydmp0aWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzA3NTcsImV4cCI6MjA2NzA0Njc1N30.Er_YyzftfdojzyMGG0gM7JflPsebEHSr-ObTpuU811o'; // îl iei din Project Settings > API

export const supabase = createClient(supabaseUrl, supabaseKey);
