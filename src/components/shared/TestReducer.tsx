"use client";

import React, { useReducer } from 'react';

// Define state and action types for the reducer
interface TestState {
  count: number;
}

type TestAction = { type: 'increment' } | { type: 'decrement' };

// Reducer function
function reducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error('Unknown action type');
  }
}

// Initial state
const initialState: TestState = { count: 0 };

// Test component
export default function TestReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>TestReducer Component</h2>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })} style={{ marginRight: '10px' }}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        Decrement
      </button>
      <p><i>If you see this and can interact with the buttons without errors, the basic useReducer setup is working.</i></p>
    </div>
  );
}