import React from "react";
import { motion } from "motion/react";
// import { Link } from "react-router-dom";
import Animated from "../components/Animated";

export const Orbit: React.FC = () => {
  return (
    <section className="py-24 h-full bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
            Industry Coverage
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-gray-800">Prepare for interviews in any field</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI interview platform supports a wide range of industries and roles, helping you prepare for any opportunity.
          </p>
        </motion.div>

        <Animated />
      </div>
    </section>
  );
};