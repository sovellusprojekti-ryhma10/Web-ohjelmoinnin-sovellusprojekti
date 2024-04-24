import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import MovieSearch from '../components/MovieSearch';
import MoviePage from '../components/MoviePage';
import MovieSearchByActorName from '../components/MovieSearchByActorName'

function FindMovies() {
    const [mediaType, setMediaType] = useState("movie");

    return (
        <div>
            <Routes>
                <Route path="" element={<MovieSearch setMediaType={setMediaType} mediaType={mediaType} />} />
                <Route path="/:mediaType/:movieID" element={<MoviePage mediaType={mediaType} />} />
            </Routes>
			<MovieSearchByActorName />
        </div>
    );
}

export default FindMovies;
