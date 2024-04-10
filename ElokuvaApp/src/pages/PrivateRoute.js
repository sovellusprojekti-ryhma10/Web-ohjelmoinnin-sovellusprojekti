import React from 'react'
import { useUser } from '../context/useUser'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
  const { user } = useUser()
  if (!user) return <Navigate to="/login" />
  return <Outlet />
}
