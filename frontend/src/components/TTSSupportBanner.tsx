import React, { useEffect, useState } from 'react';

const TTSSupportBanner: React.FC = () => {
  const [isNotChrome, setIsNotChrome] = useState(false);

  useEffect(() => {
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isChrome = /chrome|chromium/.test(userAgent) && !/edge|opr/.test(userAgent);
    setIsNotChrome(!isChrome);
  }, []);

  if (!isNotChrome) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 px-4 text-sm z-50">
      Please use Chrome for Speech Feature
    </div>
  );
};

export default TTSSupportBanner;