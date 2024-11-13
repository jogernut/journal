import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import DailyMarkup from './pages/DailyMarkup'
import TradeEntry from './pages/TradeEntry'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="daily-markup" element={<DailyMarkup />} />
        <Route path="trade-entry" element={<TradeEntry />} />
      </Route>
    </Routes>
  )
}

export default App
