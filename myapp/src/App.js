import React, { useState } from 'react';
import './App.css';
import MovieSearch from './components/MovieSearch';
import MovieSearchByActorName from './components/MovieSearchByActorName';

function App() {
  return (
    <div className="App">
      <MovieSearch />
    </div>
  );
}

export default App;