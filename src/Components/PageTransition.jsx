import React, { useEffect, useState } from 'react';

const PageTransition = ({ children, isActive }) => {
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (isActive) {
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 300); // Reduced from 800ms
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="relative">
      {transitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-6xl animate-spin">🏎️</div>
        </div>
      )}
      
      <div className={`transition-all duration-300 ${transitioning ? 'opacity-50' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  );
};

export default PageTransition;