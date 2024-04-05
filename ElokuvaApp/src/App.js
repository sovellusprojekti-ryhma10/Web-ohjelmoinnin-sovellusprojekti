import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom'

import MovieSearch from './components/MovieSearch';
import MovieSearchByActorName from './components/MovieSearchByActorName';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        {/* Sijoitelkaa sisältö content tagin sisään tähän diviin */}
      <MovieSearch />
      </div>
    </div>
  );
}

export default App;