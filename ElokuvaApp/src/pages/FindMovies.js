import React from 'react';
import MovieSearch from '../components/MovieSearch';
import MovieSearchByActorName from '../components/MovieSearchByActorName';
function FindMovies() {
	return (
		<div>
			<h1>Find Movies</h1>
			<MovieSearch />
			<MovieSearchByActorName />
		</div>
	);
}

export default FindMovies;