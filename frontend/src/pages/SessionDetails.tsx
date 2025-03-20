// import React from "react";
import { useLocation, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";


type Answer ={
  rating: number
  improvedAnswer?: string,
  userAnswer?: string
  question?: string
}

export const SessionDetails = () => {
  const { state } = useLocation();
  const session = state?.session;

  if (!session) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-red-500 p-6 bg-white rounded-lg shadow-lg text-center">
        <span className="text-3xl">⚠</span>
        <p className="text-lg font-medium mt-2">Error: Session data not found</p>
        <Link to="/dashboard" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );

  const chartData = session.interviewId.answers.map((ans: Answer, idx: number) => ({
    name: `Q${idx + 1}`,
    rating: ans.rating,
  }));

  const averageRating = (
    chartData.reduce((acc: number, item: Answer) => acc + item.rating, 0) / chartData.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Session Details</h1>
          <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Job Description</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">{session.interviewId.jd}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Analysis</h2>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-3xl font-bold text-blue-600">{averageRating}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Questions</p>
                <p className="text-3xl font-bold text-indigo-600">{chartData.length}</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                    labelStyle={{ fontWeight: "bold", color: "#333" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 6, strokeWidth: 2, fill: "#fff", stroke: "#3b82f6" }}
                    activeDot={{ r: 8, fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Interview Analysis</h2>
              <div className="flex flex-col gap-1 text-sm text-gray-500 mb-4">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium text-gray-700">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Position:</span>
                  <span className="font-medium text-gray-700">Software Engineer</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Number(averageRating) * 10}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 ml-2">{averageRating}/10</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Overall performance based on your interview responses.
                </p>
              </div>
            </div>

            {/* Interview Questions and Answers */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Interview Questions</h2>
              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {session.interviewId.answers.map((answer: Answer, index: number) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-800">Q{index + 1}: {answer.question}</p>
                    <div className="mt-2 pl-4 border-l-2 border-gray-200">
                      <p className="text-gray-700 text-sm mb-1"><span className="font-medium">Your Answer:</span> {answer.userAnswer}</p>
                      <div className="flex items-center my-2">
                        <span className="text-xs text-gray-500 mr-2">Rating:</span>
                        <div className="flex items-center">
                          {[...Array(10)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < answer.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-sm font-medium text-gray-700">{answer.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm"><span className="font-medium">Improved Answer:</span> {answer.improvedAnswer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};