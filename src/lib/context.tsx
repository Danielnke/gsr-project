"use client";

import * as React from 'react';
import { createContext, useContext, useReducer } from 'react';

// Define the state type
type AppState = {
  currentSection: string;
  debug: boolean;
};

// Define the action types
export type AppAction =
  | { type: 'SET_CURRENT_SECTION'; payload: string }
  | { type: 'TOGGLE_DEBUG' };

// Define the context type
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
};

// Create the context
const AppContext = createContext<AppContextType | null>(null);

// Initial state
const initialState: AppState = {
  currentSection: 'introduction',
  debug: false,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_SECTION':
      return { ...state, currentSection: action.payload };
    case 'TOGGLE_DEBUG':
      return { ...state, debug: !state.debug };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}