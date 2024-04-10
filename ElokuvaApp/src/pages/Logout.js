import React from 'react'
import { useUser } from '../context/useUser'

export default function Logout() {
  const { setUser } = useUser()
  setUser(null)
  return (
    <p>You have logged out.</p>
  )
}
