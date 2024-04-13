import React from "react";
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
import MoviePage from "./components/MoviePage";
import MovieSearch from "./components/MovieSearch";

function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<MovieSearch />} />
        <Route path="/movie/:movieID" element={<MoviePage />} />
        <Route path="/Group" element={<GroupSearchPage />} />
        <Route path="/group/:groupId" element={<GroupPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/CreateAcc" element={<CreateAcc />} />
        <Route path="/personal" element={<PrivateRoute />}>
          <Route index element={<Personal />} />
          <Route path="favoriteLists" element={<FavoriteLists />} />
          <Route path="favoriteLists/:listId" element={<SpecificList />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
