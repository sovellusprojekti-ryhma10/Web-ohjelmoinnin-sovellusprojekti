import React, { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./pages/PrivateRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import UserProvider from "./context/UserProvider";
import { Route, Routes } from "react-router-dom";
import GroupSearchPage from "./pages/GroupSearchPage";
import GroupPage from "./pages/GroupPage";
import Personal from "./pages/Personal";
import CreateAcc from "./pages/CreateAcc";
import FavoriteLists from "./pages/FavoriteLists";
import SpecificList from "./components/SpecificList";
import MovieSearch from "./components/MovieSearch";
import MoviePage from "./components/MoviePage";

function App() {
  const [mediaType, setMediaType] = useState("movie"); // mediaType hook täytyy määritellä App.js:ssä jotta sitä voi käyttää sekä MovieSearchissa että MoviePagessa

  return (
    <UserProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/Group" exact element={<GroupSearchPage />} />
          <Route path="/group/:groupId" exact element={<GroupPage />} />
          <Route path="/" element={<Home />} />
          <Route
            exact
            path="/search"
            element={
              <MovieSearch setMediaType={setMediaType} mediaType={mediaType} />
            }
          />
          <Route
            path="/:mediaType/:movieID"
            element={<MoviePage mediaType={mediaType} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/CreateAcc" element={<CreateAcc />} />
          <Route path="/personal" element={<PrivateRoute />}>
            <Route index element={<Personal />} />
            <Route path="favoriteLists" element={<FavoriteLists />} />
            <Route path="favoriteLists/:listId" element={<SpecificList />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
