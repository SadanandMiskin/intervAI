import React, { useEffect, useState } from "react";
import OrbitalTagsSection from "../components/OrbitalTagsSections";
import HowItWorks from "../components/HowItWorks";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import TTSSupportBanner from "../components/TTSSupportBanner";
// import { DotPattern } from "../components/magicui/dot-pattern";

const Homepage: React.FC = () => {
  const [gradientPosition, setGradientPosition] = useState(100);
  // const [animationComplete, setAnimationComplete] = useState(false);
    const token = localStorage.getItem('token')

  useEffect(() => {

    let position = 0;

    const interval = setInterval(() => {
      position += 2;
      setGradientPosition(position);

      if (position == 100) {
        clearInterval(interval);
        // setAnimationComplete(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <>

<TTSSupportBanner />

{/* <DotPattern /> */}
    <div className="min-h-screen bg-gray-300 text-white font-sans">

      <nav className="fixed w-full flex justify-between items-center px-6 py-4 bg-gray-100/80 backdrop-blur-sm z-10">
        <div className="text-xl font-bold tracking-tight text-black">
          <Link to={'/'}>IntervAI</Link>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all">
          {/* <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg> */}
          <FaGoogle />
          Login with Google
        </button>
      </nav>

      <section
        className="flex justify-center items-center h-screen p-6 md:px-20 transition-all duration-1000"
        style={{
          backgroundColor: "hsla(0,0%,90%,1)",
          backgroundImage: `radial-gradient(at ${gradientPosition}% 50%, hsla(219,100%,50%,1) 0px, transparent 50%), radial-gradient(at ${gradientPosition - 5}% 48%, hsla(68,90%,56%,1) 0px, transparent 60%)`,
        }}
      >
        <div className="w-full text-center  ">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 bg-blue-100/50 px-4 py-2 rounded-full">AI-Powered Interviews</span>
          <h1 className="text-6xl md:text-7xl lg:text-9xl font-extrabold leading-tight text-gray-900">
            Converse.
            <br />
            Discover.
            <br />
            Evolve.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-700 text-center ">
            Check your Knowledge before a 'REAL' interview.
           </p>
          <div className="mt-8 flex justify-center gap-4 ">
            <Link to="/dashboard">
            <button className="px-6 md:px-18 py-3 md:py-4  bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl">
              {token ? 'Dashboard' : 'Get Started'}
            </button>
            </Link>
            {/* <button className="px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-gray-800 text-gray-800 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all">
              Learn More
            </button> */}
          </div>
        </div>
      </section>

       <OrbitalTagsSection />
       <HowItWorks />
    </div>
    </>
  );
};

export default Homepage;