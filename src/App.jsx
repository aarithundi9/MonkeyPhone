import { Routes, Route } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import TestScreen from './components/TestScreen'
import ResultsScreen from './components/ResultsScreen'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0e0e0f] flex flex-col">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/test" element={<TestScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
      </Routes>
    </div>
  )
}
