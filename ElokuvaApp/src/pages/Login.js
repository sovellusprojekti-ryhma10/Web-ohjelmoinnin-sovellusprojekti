import { useNavigate } from 'react-router-dom'
import './Login.css'
import React, { useState } from 'react'
import { useUser } from '../context/useUser'
import "../index.css";
export default function Login() {
  const { login } = useUser()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const validate = (e) => {
    e.preventDefault()
    if (username.length >0 && password.length >0) {
      const data = {"user":username,"password":password}
      login(data)
    }
  }

  return (
    <div className="content">
      <form onSubmit={validate}>
        <h3>Login</h3>
        <div>
          <label>User</label>
          <input value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <button>Submit</button>
      </form>
    </div>
  )
}
