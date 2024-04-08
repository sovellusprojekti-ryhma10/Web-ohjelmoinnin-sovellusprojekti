import { useNavigate } from 'react-router-dom'
import './Login.css'
import React, { useState } from 'react'
import { useUser } from '../context/useUser'
import "../index.css";
import { Link } from 'react-router-dom'

export default function Login() {
  const { login } = useUser()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const validate = (e) => {
    e.preventDefault()
    // fake login without db
    if (username === 'admin' && password === 'admin') {
      console.log('login ok')
        setUser({user: username,password: password})
        navigate("/")
    }
  }

  return (
    <div className="formcontent">

      <form id="login-form" onSubmit={validate}>
              <h1>Kirjaudu</h1>
              <h2>Käyttäjätiedot</h2>
        <div>
          <p className='formlabel'>Username</p>
          <input className="input" value={username} placeholder='username' onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
          <p className='formlabel'>Password </p>
          <input className="input" type="password"  placeholder='password' value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div>
          {/* <p className='formlabel'>Toista salasana </p>
          <input className="input2" type="passwordAgain"  placeholder='Repeat the new password' value={password} onChange={e => setPassword(e.target.value)}/> */}
        </div>

        <button id='submit'>Kirjaudu</button>
        <button id='submit'>Poista tili</button>
        {/* <button id='submit'>Muuta salasana</button> */}

      </form>

      <Link className="linksign" to="/create">Luo tili</Link>
    </div>
  )
}
