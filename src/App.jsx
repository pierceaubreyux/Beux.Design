import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [showPage, setShowPage] = useState(false)

  return (
    <>
      {loading && (
        <LoadingScreen
          onComplete={() => {
            setShowPage(true) // Mount page first
            setTimeout(() => setLoading(false), 2200) // Remove loader after curtain animation completes
          }}
        />
      )}
      {showPage && (
        <>
          <CustomCursor />
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </>
      )}
    </>
  )
}
