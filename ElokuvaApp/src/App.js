import React, { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./pages/PrivateRoute";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import UserProvider from "./context/UserProvider";
import { Route, Routes } from "react-router-dom";
import Personal from "./pages/Personal";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/personal"
          element={
            <PrivateRoute>
              <Personal />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <div className="App">
        <Navbar />
        <div className="content">
          {/* Sijoitelkaa sisältö content tagin sisään jokaiselle sivulle ja tuokaa import '../index.css'; sivulle */}
        </div>
      </div>
    </UserProvider>
  );
}

export default App;
