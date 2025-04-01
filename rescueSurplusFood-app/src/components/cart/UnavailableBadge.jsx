import React, { useEffect, useState } from 'react';

const UnavailableBadge = ({ isVisible }) => {
  const [visible, setVisible] = useState(isVisible);
  
  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);
  
  if (!visible) return null;
  
  return (
    <div className="unavailable-badge">
      <i className="bi bi-exclamation-triangle"></i>
      <span>This bag is no longer available</span>
    </div>
  );
};

export default UnavailableBadge;