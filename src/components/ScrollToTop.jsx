import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Handle route changes
  useEffect(() => {
    // Small delay to ensure DOM is ready, then scroll to top
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle page refresh/initial load
  useEffect(() => {
    // Multiple approaches to ensure scroll to top on page load/refresh
    
    // 1. Immediate scroll
    window.scrollTo(0, 0);
    
    // 2. After a small delay
    const immediateTimer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 0);

    // 3. Listen for window load event (for page refresh)
    const handleWindowLoad = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    };

    // Add event listener for window load
    window.addEventListener('load', handleWindowLoad);

    // 4. Also handle when DOM is fully loaded
    if (document.readyState === 'loading') {
      const handleDOMContentLoaded = () => {
        window.scrollTo(0, 0);
      };
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
      
      return () => {
        clearTimeout(immediateTimer);
        window.removeEventListener('load', handleWindowLoad);
        document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      };
    } else {
      // DOM is already loaded
      return () => {
        clearTimeout(immediateTimer);
        window.removeEventListener('load', handleWindowLoad);
      };
    }
  }, []);

  return null;
};

export default ScrollToTop; 