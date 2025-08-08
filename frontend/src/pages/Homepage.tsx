import React, { useEffect, useState } from "react";
// import OrbitalTagsSection from "../components/OrbitalTagsSections";
import HowItWorks from "../components/HowItWorks";
import { Link } from "react-router-dom";
import TTSSupportBanner from "../components/TTSSupportBanner";
import Navbar from "./Navbar";
import { motion } from "motion/react";
import { Orbit } from "./Orbit";

const Homepage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const token = localStorage.getItem('token');

  // Track mouse movement for interactive gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <TTSSupportBanner />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-gray-800 font-sans">
        <Navbar />

        <section
          className="relative flex justify-center items-center min-h-screen p-6 md:px-20 overflow-hidden "
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 140, 246, 0.15) 0%, transparent 50%),
              linear-gradient(to right, rgba(249, 250, 251, 0.9), rgba(243, 244, 246, 0.9))
            `,
          }}
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>

          <div className="w-full max-w-6xl mx-auto text-center relative z-10 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm">
                AI-Powered Interviews
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Converse.
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
                Discover.
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-600">
                Evolve.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Prepare with confidence for your next interview. Get real-time AI feedback on your responses and improve your skills.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/dashboard">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  {token ? 'Go to Dashboard' : 'Get Started for Free'}
                </button>
              </Link>

              {/* <button className="mt-4 sm:mt-0 px-8 py-4 bg-white text-blue-600 border border-blue-200 text-lg font-semibold rounded-full hover:bg-blue-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
                Watch Demo
              </button> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {[
                {
                  icon: "🎯",
                  title: "Personalized Feedback",
                  desc: "Get AI-driven insights tailored to your unique interview style and responses"
                },
                {
                  icon: "🔄",
                  title: "Unlimited Practice",
                  desc: "Access thousands of real-world interview questions across various industries"
                },
                {
                  icon: "📈",
                  title: "Track Progress",
                  desc: "Monitor your improvement with detailed performance analytics over time"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="text-3xl mb-4 bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Orbit />
        <HowItWorks />
      </div>
    </>
  );
};

export default Homepage;