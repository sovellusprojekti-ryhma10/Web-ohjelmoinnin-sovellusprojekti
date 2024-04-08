import { useNavigate } from 'react-router-dom'
import './Login.css'
import bstyles from './Login.css'
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
    <div className="formcontent">
      <form onSubmit={validate}>
              <h1>Luo tili</h1>
              <h2>Käyttäjätiedot</h2>
        <div>
          <p className='formlabel'>Username</p>
          <input className="input" value={username} placeholder='username' onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
          <p className='formlabel'>Password </p>
          <input className="input" type="password"  placeholder='password' value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <button id='submit'>Submit</button>
      </form>
    </div>
  )
}
