import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zaowuqsutznsudfppcsf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inphb3d1cXN1dHpuc3VkZnBwY3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4OTk2MDYsImV4cCI6MjA2ODQ3NTYwNn0.tF8yLC5VK8LhvCdePBsd21CBf7dK-AnHBUat7vc2UZg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)