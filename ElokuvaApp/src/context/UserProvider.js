import { useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProvider({children}) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const login = async(data) => {
    const json = JSON.stringify(data)
    const options = {
      headers: {
        'Content-Type':'application/json'
      }
    }

    axios.post('http://localhost:3001/login',json,options)
      .then(response => {
        const token = response.data.token
        setUser({...data,"token":token})
        sessionStorage.setItem("user", user)
        navigate("/")
      })
      .catch(error => {
        throw error
      })
  }
  const register = async(data) => {
    const json = JSON.stringify(data)
    const options = {
      headers: {
        'Content-Type':'application/json'
      }
    }

    axios.post('http://localhost:3001/register',json,options)
      .then(response => {
        const token = response.data.token
        setUser({...data,"token":token})
        sessionStorage.setItem("user", user)
        navigate("/")
      })
      .catch(error => {
        throw error
      })
  }

  return (
    <UserContext.Provider value={{user,setUser,login,register}}>
      { children }
    </UserContext.Provider>
  )
}
