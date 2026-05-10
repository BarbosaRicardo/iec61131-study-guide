import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Intro from './pages/Intro'
import DataTypes from './pages/DataTypes'
import StructuredText from './pages/StructuredText'
import LadderDiagram from './pages/LadderDiagram'
import FunctionBlockDiagram from './pages/FunctionBlockDiagram'
import SequentialFunctionChart from './pages/SequentialFunctionChart'
import POUs from './pages/POUs'
import RTACSpecific from './pages/RTACSpecific'
import Troubleshoot from './pages/Troubleshoot'
import Lab from './pages/Lab'

export default function App() {
  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto pt-14 lg:pt-0">
        <Routes>
          <Route path="/"             element={<Intro />} />
          <Route path="/datatypes"    element={<DataTypes />} />
          <Route path="/st"           element={<StructuredText />} />
          <Route path="/ld"           element={<LadderDiagram />} />
          <Route path="/fbd"          element={<FunctionBlockDiagram />} />
          <Route path="/sfc"          element={<SequentialFunctionChart />} />
          <Route path="/pou"          element={<POUs />} />
          <Route path="/rtac"         element={<RTACSpecific />} />
          <Route path="/troubleshoot" element={<Troubleshoot />} />
          <Route path="/lab"          element={<Lab />} />
        </Routes>
      </main>
    </div>
  )
}
