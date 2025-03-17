import React, { useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

export const Create = ({ setGlobalSocket }: { setGlobalSocket: (socket: Socket) => void }) => {
  const [jd, setJD] = useState<string>("");
  const navigate = useNavigate();

  const handleSendJD = () => {
    if (jd.trim() !== "") {
      const socket: Socket = io("http://localhost:3000"); // Establish WebSocket connection
      socket.emit("sendjd", jd);
      setJD("");

      setGlobalSocket(socket); // Store socket globally
      navigate("/interview"); // Navigate without passing socket
    }
  };

  return (
    <div>
      <h2>Enter Job Description</h2>
      <input
        type="text"
        value={jd}
        onChange={(e) => setJD(e.target.value)}
        placeholder="Enter Job Description"
      />
      <button onClick={handleSendJD}>Start Interview</button>
    </div>
  );
};
