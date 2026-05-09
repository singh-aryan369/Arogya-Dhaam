import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import EmergencyBar from './EmergencyBar.jsx';
import RouteProgress from './RouteProgress.jsx';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <RouteProgress />
      <EmergencyBar />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
