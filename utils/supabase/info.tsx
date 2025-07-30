// Simplified Supabase info for the current environment
// This file maintains the structure but uses mock data to prevent deployment errors

export const projectId = 'mock-project-id'
export const publicAnonKey = 'mock-anon-key'

// Note: In a production environment, these would be:
// export const projectId = process.env.REACT_APP_SUPABASE_PROJECT_ID || 'your-project-id'
// export const publicAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'