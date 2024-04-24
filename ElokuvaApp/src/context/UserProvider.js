import { useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
//login
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
        toast.success("Kirjauduttu sisään!");
        const updatedUser = { ...data, token: token };
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser)); // Store the updated user object
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(`This is the error: ${error.response.data.error}`);
      });
  };
// register
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
        toast.success("Luotu käyttäjä ", {user}," ja kirjauduttu!");
        const updatedUser = { ...data, token: token };
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser)); // Store the updated user object
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(`This is the error: ${error.response.data.error}`);

      });
  };


  return (
    <UserContext.Provider value={{ user, setUser, login, register }}>
      {children}
    </UserContext.Provider>
  );
}
