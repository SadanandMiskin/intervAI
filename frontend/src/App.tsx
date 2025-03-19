import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Create } from "./pages/Create";
import { Interview } from "./pages/Interview";
import { Socket } from "socket.io-client";
import { Results } from "./pages/Results";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";

function App() {
  const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);
  const googleCliendId = ""
  return (

    <GoogleOAuthProvider clientId={googleCliendId}>
      <AuthProvider>
        <Router>
          <Routes>
          <Route path="/login" element={<Login />} />

<Route path="/create" element={

 <ProtectedRoute>
   <Create setGlobalSocket={setGlobalSocket} />
 </ProtectedRoute>

  } />
<Route path="/interview" element={
<ProtectedRoute>
  <Interview globalSocket={globalSocket} />
</ProtectedRoute>
} />
<Route path="/results" element={
<ProtectedRoute>
  <Results />
</ProtectedRoute>
} />
<Route path="/dashboard" element={
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>


    // <Router>
    //   <Routes>

    //   </Routes>
    // </Router>
  );
}

export default App;
