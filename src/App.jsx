import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Members from './components/Members'
import SuccessfulStudents from './components/SuccessfulStudents'
import Services from './components/Services'
import WhyChoose from './components/WhyChoose'
import Contact from './components/Contact'
import Register from './components/Register'
import Map from './components/Map'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import Profile from './components/Profile'
import QuizExam from './components/QuizExam'
import Certificate from './components/Certificate'
import GalleryPreview from './components/GalleryPreview'
import Gallery from './components/Gallery'
import Admission from './components/Admission'
import TeacherJob from './components/TeacherJob'
import Notice from './components/Notice'
import Teachers from './components/Teachers'
import MembersPage from './components/MembersPage'
import { SocketProvider } from './contexts/SocketContext.jsx'

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz-exam" element={<QuizExam />} />
          <Route path="/certificate/:resultId" element={<Certificate />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/" element={
            <div className="app">
              <Navbar />
              <Hero />
              <About />
              <Members />
              <SuccessfulStudents />
              <Services />
              <WhyChoose />
              <GalleryPreview />
              <Admission />
              <TeacherJob />
              <Contact />
              <Map />
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </SocketProvider>
  )
}

export default App
