import { useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (data) => {
    const json = JSON.stringify(data);
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post("http://localhost:3001/login", json, options)
      .then((response) => {
        const token = response.data.token;
        const updatedUser = { ...data, token: token };
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser)); // Store the updated user object
        navigate("/");
      })
      .catch((error) => {
        throw error;
      });
  };

  const register = async (data) => {
    const json = JSON.stringify(data);
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post("http://localhost:3001/register", json, options)
      .then((response) => {
        const token = response.data.token;
        const updatedUser = { ...data, token: token };
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser)); // Store the updated user object
        navigate("/");
      })
      .catch((error) => {
        throw error;
      });
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, register }}>
      {children}
    </UserContext.Provider>
  );
}
