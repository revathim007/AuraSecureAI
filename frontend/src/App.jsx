import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return (
    <div className="App min-h-screen bg-[#f8fafc]">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
