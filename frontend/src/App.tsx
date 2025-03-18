import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Create } from "./pages/Create";
import { Interview } from "./pages/Interview";
import { Socket } from "socket.io-client";
import { Results } from "./pages/Results";

function App() {
  const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Create setGlobalSocket={setGlobalSocket} />} />
        <Route path="/interview" element={<Interview globalSocket={globalSocket} />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
