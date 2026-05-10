import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Index';
import RoadmapEditor from './pages/roadmap/Index';

function App() {
  return (
    <Routes>
      <Route path="/:appId/:planId" element={<RoadmapEditor />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
