import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import WeekView from './Pages/WeekView';
import DayView from './Pages/DayView';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
        <h1 className=" text-blue-500 font-bold py-2 px-4 rounded text-xl">Weekly Planner</h1>

          <div className="header-buttons">
            <Link to="/day" className="mr-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Day</Link>
            <Link to="/" className="ml-1 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Week</Link>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<WeekView />} />
          <Route path="/day" element={<DayView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
