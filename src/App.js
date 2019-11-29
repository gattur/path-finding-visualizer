import React from 'react';
import logo from './logo.svg';
import './App.css';
import PathFindingVisualizer from './PathFindingVisualizer/PathFindingVisualizer'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <PathFindingVisualizer></PathFindingVisualizer>
    </div>
  );
}

export default App;
