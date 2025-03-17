import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Create } from "./pages/Create";
import { Interview } from "./pages/Interview";
import { Socket } from "socket.io-client";

function App() {
  const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Create setGlobalSocket={setGlobalSocket} />} />
        <Route path="/interview" element={<Interview globalSocket={globalSocket} />} />
      </Routes>
    </Router>
  );
}

export default App;
