import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';


interface Answer {
  question: string;
  userAnswer: string;
  rating: number;
  improvedAnswer: string;
}

interface Interview {
  _id: string;
  jd: string;
  answers: Answer[];
}

interface Session {
  _id: string;
  interviewId: Interview;
  createdAt: string;
  updatedAt: string;
}

interface SessionData {
  email: string;
  sessions: Session[];
}

export const Dashboard = () => {
  const { token, logout } = useAuth();
  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result: SessionData = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Calculate session stats if data is available
  const sessionCount = data?.sessions?.length || 0;
  const latestSession = data?.sessions?.[0]?.createdAt
    ? new Date(data.sessions[0].createdAt).toLocaleDateString()
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Interview Dashboard</h1>
              {data?.email && (
                <p className="text-sm text-gray-500 mt-1">{data.email}</p>
              )}
            </div>
            <div className="flex space-x-3">
              <Link to="/create" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Interview
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
         <div className="p-6 text-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
         </svg>
         <h3 className="mt-2 text-sm font-medium text-gray-900">No interview sessions</h3>
         <p className="mt-1 text-sm text-gray-500">
           Get started by creating a new interview session.
         </p>
         <div className="mt-6">
           <Link to="/create" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
             <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
             </svg>
             New Interview
           </Link>
         </div>
       </div>
        )}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-sm font-medium text-gray-500">Total Sessions</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900">{sessionCount}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-sm font-medium text-gray-500">Latest Interview</h2>
                <p className="mt-2 text-3xl font-bold text-gray-900">{latestSession}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-sm font-medium text-gray-500">Account Status</h2>
                <p className="mt-2 text-3xl font-bold text-green-600">Active</p>
              </div>
            </div>

            {/* Sessions List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Interview Sessions
                </h3>
              </div>

              {!data?.sessions  || data.sessions.length === 0 ? (
                <div className="p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No interview sessions</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new interview session.
                  </p>
                  <div className="mt-6">
                    <Link to="/create" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      New Interview
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {data.sessions.map((session) => {

                    const answers = session.interviewId.answers || [];
                    const avgRating = answers.length
                      ? (answers.reduce((sum, ans) => sum + ans.rating, 0) / answers.length).toFixed(1)
                      : 'N/A';

                    
                    const createdDate = session.createdAt
                      ? new Date(session.createdAt).toLocaleDateString()
                      : 'N/A';

                    return (
                      <div
                        key={session.interviewId._id}
                        className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
                        onClick={() => navigate(`/session/${session.interviewId._id}`, { state: { session } })}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900 truncate" title={session.interviewId.jd}>
                              {session.interviewId.jd.length > 40
                                ? `${session.interviewId.jd.substring(0, 40)}...`
                                : session.interviewId.jd}
                            </h3>
                            <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-xs">
                              {answers.length} Q&A
                            </span>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="ml-1 text-sm text-gray-700">{avgRating}</span>
                            </div>
                            <span className="text-xs text-gray-500">{createdDate}</span>
                          </div>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 border-t border-gray-200">
                          <span className="text-sm text-blue-600 font-medium">View Details →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};