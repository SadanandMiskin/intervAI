import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate, Link } from "react-router-dom";

export const Create = ({ setGlobalSocket }: { setGlobalSocket: (socket: Socket) => void }) => {
  const [jd, setJD] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const MIN_CHARS = 10;
  const navigate = useNavigate();

  useEffect(() => {
    let interval = 0

    if (isLoading) {
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 40);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Handle navigation after loading completes
  useEffect(() => {
    if (loadingProgress === 100 && isLoading) {
      const socket: Socket = io("http://localhost:3000", {
        auth: { token: localStorage.getItem("token") },
      });

      socket.emit("sendjd", jd);
      setGlobalSocket(socket);
      navigate("/interview");
    }
  }, [loadingProgress, isLoading, jd, setGlobalSocket, navigate]);

  const handleSendJD = () => {
    if (jd.trim().length >= MIN_CHARS) {
      setIsLoading(true);
      setLoadingProgress(0);
      // The actual socket connection will happen after the loading animation completes
    }
  };

  const isValidInput = jd.trim().length >= MIN_CHARS;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Interview</h1>
          <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Enter Job Description
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Provide a detailed job description to generate tailored interview questions.
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="job-description"
                    rows={8}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${
                      jd.trim().length > 0 && jd.trim().length < MIN_CHARS
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md p-3`}
                    placeholder="Paste the full job description here. Include key responsibilities, required skills, and qualifications..."
                    value={jd}
                    onChange={(e) => setJD(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="mt-2 flex justify-between">
                  <p className="text-sm text-gray-500">
                    More detailed descriptions will result in better targeted interview questions.
                  </p>
                  {jd.trim().length > 0 && jd.trim().length < MIN_CHARS && (
                    <p className="text-sm text-red-500">
                      Minimum {MIN_CHARS} characters required
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">Character count: </span>
                    <span className={`font-medium ${
                      jd.length === 0
                        ? "text-gray-700"
                        : jd.length < MIN_CHARS
                          ? "text-red-600"
                          : "text-green-600"
                    }`}>
                      {jd.length}
                    </span>
                    <span className="text-gray-500"> / {MIN_CHARS} min</span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={handleSendJD}
                    disabled={!isValidInput || isLoading}
                    className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white relative overflow-hidden ${
                      !isValidInput || isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: `${loadingProgress}%` }}></div>
                        <span className="relative z-10">Starting Session...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Start Interview
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-3">Tips for Better Results</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Include specific technical skills and technologies required for the position
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Mention key responsibilities and day-to-day activities
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Add qualifications like education and years of experience
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Describe the team structure and collaboration expectations
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};