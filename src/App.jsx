import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout.jsx';
import PageTransition from './components/PageTransition.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Specialties from './pages/Specialties.jsx';
import Doctors from './pages/Doctors.jsx';
import Departments from './pages/Departments.jsx';
import Appointments from './pages/Appointments.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"             element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about"        element={<PageTransition><About /></PageTransition>} />
          <Route path="/specialties"  element={<PageTransition><Specialties /></PageTransition>} />
          <Route path="/doctors"      element={<PageTransition><Doctors /></PageTransition>} />
          <Route path="/departments"  element={<PageTransition><Departments /></PageTransition>} />
          <Route path="/appointments" element={<PageTransition><Appointments /></PageTransition>} />
          <Route path="/contact"      element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/blog"         element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:id"     element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="*"             element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
