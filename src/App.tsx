import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import HeritageSites from './pages/HeritageSites'
import AIAssessment from './pages/AIAssessment'
import ConservationCases from './pages/ConservationCases'
import StoryMode from './pages/StoryMode'
import EncroachmentDetection from './pages/EncroachmentDetection'
import VisitorFlowAgent from './pages/VisitorFlowAgent'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Landing />} />

        {/* App shell with sidebar */}
        <Route element={<Layout />}>
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="sites"        element={<HeritageSites />} />
          <Route path="assessment"   element={<AIAssessment />} />
          <Route path="cases"        element={<ConservationCases />} />
          <Route path="story"        element={<StoryMode />} />
          <Route path="encroachment" element={<EncroachmentDetection />} />
          <Route path="visitor-flow" element={<VisitorFlowAgent />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
