import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>Home | Mern Starter</title>
      </Helmet>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <h2>Landing Page</h2>

        <div>
          <Link to="/app">Dashboard</Link>
        </div>
      </div>
    </>
  )
}
export default LandingPage
