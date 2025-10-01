import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

    const timer = setTimeout(scrollToTop, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // Immediate scroll for page load/refresh
    window.scrollTo(0, 0);
    
    const handleWindowLoad = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };

    const handleDOMContentLoaded = () => {
      window.scrollTo(0, 0);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    }
    
    window.addEventListener('load', handleWindowLoad);

    return () => {
      window.removeEventListener('load', handleWindowLoad);
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    };
  }, []);

  return null;
};

export default ScrollToTop;