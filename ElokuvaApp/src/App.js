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
import CreateAccount from "./pages/CreateAccount"
import FavoriteLists from "./pages/FavoriteLists";
import SpecificList from "./components/SpecificList";
import MovieSearch from "./components/MovieSearch";
import MoviePage from "./components/MoviePage";

function App() {
  const [mediaType, setMediaType] = useState("movie");

  return (
    <UserProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/Group" element={<GroupSearchPage />} />
          <Route path="/group/:groupId" element={<GroupPage />} />
          <Route path="/*" element={<Home />} />{" "}
          {/* Adjusted path to include a trailing "*" */}
          <Route
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
          <Route path="/CreateAcc" element={<CreateAccount />} />
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
