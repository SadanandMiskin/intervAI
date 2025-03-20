import React from "react";

const OllamaSolarSystem: React.FC = () => {
  return (
    <section className="relative py-36 px-4 sm:px-6 bg-gray-100 overflow-hidden  ">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center mt-5 space-y-12 lg:space-y-0 lg:space-x-12">
      
        <div className="relative w-full lg:w-1/2 flex justify-center items-center">
          <div className="relative w-60 sm:w-72 h-60 sm:h-72 flex justify-center items-center">

            <div className="p-16 sm:p-20 absolute z-10 w-32 h-32 sm:w-40 sm:h-40 bg-blue-100 rounded-full flex justify-center items-center shadow-lg border-4 border-white">
              <div className="text-md sm:text-lg font-bold text-blue-600">IntervAI</div>
            </div>
            {[
              { text: "AI", color: "bg-blue-500", x: "0%", y: "-120%" },
              { text: "Web", color: "bg-purple-500", x: "-120%", y: "0%" },
              { text: "ML", color: "bg-indigo-500", x: "0%", y: "120%" },
              { text: "Cloud", color: "bg-pink-500", x: "120%", y: "0%" },
              { text: "Data", color: "bg-green-500", x: "80%", y: "-80%" },
              { text: "API", color: "bg-yellow-500", x: "-80%", y: "80%" },
              { text: "Any", color: "bg-yellow-500", x: "100%", y: "80%" },
              { text: "App", color: "bg-red-500", x: "-100%", y: "-80%" },
            ].map(({ text, color, x, y }, index) => (
              <div
                key={index}
                className={`p-8 sm:p-12 absolute w-16 h-16 sm:w-20 sm:h-20 ${color} text-white font-bold flex justify-center items-center rounded-full shadow-md border-4 border-white text-xs sm:text-sm`}
                style={{ transform: `translate(${x}, ${y})` }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>


        <div className="w-full lg:w-1/2 text-center lg:text-left px-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Specially curated questions
            <span className="block text-blue-600"> for you</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-xl text-gray-700 leading-relaxed">
            Topics covered by IntervAI - 'ANYTHING'
          </p>
          <button className="mt-6 px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white text-md sm:text-lg font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
            Lets Go
          </button>
        </div>
      </div>
    </section>
  );
};

export default OllamaSolarSystem;