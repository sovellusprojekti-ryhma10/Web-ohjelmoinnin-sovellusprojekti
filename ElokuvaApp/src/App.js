import React from "react";
import "./App.css";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./pages/PrivateRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import UserProvider from "./context/UserProvider";
import GroupSearchPage from './pages/GroupSearchPage'
import GroupPage from './pages/GroupPage'
import { Route, Routes } from "react-router-dom";
import Personal from "./pages/Personal";
import CreateAcc from "./pages/createAcc";
import FavoriteLists from "./pages/FavoriteLists";
import SpecificList from "./components/SpecificList";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/Group" exact element={<GroupSearchPage />} />
        <Route path="/group/:groupId" exact element={<GroupPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/CreateAcc" element={<CreateAcc />} />
        <Route path="/personal" element={<PrivateRoute />}>
          <Route index element={<Personal />} />
          <Route path="favoriteLists" element={<FavoriteLists />} />
          <Route path="favoriteLists/:listId" element={<SpecificList />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="App">
        <Navbar />
        <div className="content">{/* Add your content here */}</div>
      </div>
    </UserProvider>
  );
}

export default App;
