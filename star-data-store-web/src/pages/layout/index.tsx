import React from 'react'
import { Box } from '@mui/material'
import Header from '@/components/Header'
import Main from '@/pages/main'
import Footer from '@/components/Footer'
// import KeepAlive, { withActivation, AliveScope } from 'react-activation'
import { useLocation } from 'react-router-dom'
import './layout.scss'

export default function index({ children }) {
  const location = useLocation()
  console.log(location)
  // const {
  //   location: { pathname, search },
  // } = props

  return (
    <div className="layout">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
