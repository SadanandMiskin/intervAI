import React from "react";
import { FaFileAlt, FaRobot, FaMicrophone, FaCheckCircle } from "react-icons/fa";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Submit Your Job Description",
      description: "Upload or paste the job description to generate AI-powered interview questions tailored for you.",
      icon: <FaFileAlt className="text-blue-600 text-4xl" />,
    },
    {
      title: "AI Generates Questions",
      description: "Our advanced AI crafts personalized interview questions based on the provided job description.",
      icon: <FaRobot className="text-purple-600 text-4xl" />,
    },
    {
      title: "Answer with Your Voice/Text",
      description: "Speak/Write your responses naturally—our AI converts speech to text and evaluates your answer.",
      icon: <FaMicrophone className="text-green-600 text-4xl" />,
    },
    {
      title: "Get Instant Feedback",
      description: "Receive AI-driven ratings and suggestions to improve your answers and interview skills.",
      icon: <FaCheckCircle className="text-pink-600 text-4xl" />,
    },
  ];

  return (
    <section className="py-24 bg-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-8">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
