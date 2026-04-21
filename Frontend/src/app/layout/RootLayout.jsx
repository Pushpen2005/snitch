import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar.jsx'

export default function RootLayout() {
  return (
    <div className="relative">
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  )
}
