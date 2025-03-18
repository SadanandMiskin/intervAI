import React from "react";
import { useLocation } from "react-router-dom";

export const Results = () => {
  const location = useLocation();
  const feedback = location.state?.feedback || [];

  return (
    <div className="container mx-auto mt-10 text-white">
      <h2 className="text-3xl font-bold mb-6">Interview Feedback</h2>
      {feedback.length > 0 ? (
        feedback.map((item, index) => (
          <div key={index} className="p-4 mb-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold">{item.question}</h3>
            <p className="text-sm text-gray-400">Your Answer: {item.originalAnswer}</p>
            <p className="text-sm text-green-400">Improved Answer: {item.improvedAnswer}</p>
            <p className="text-sm text-blue-400">Rating: {item.rating}/10</p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No feedback available.</p>
      )}
    </div>
  );
};