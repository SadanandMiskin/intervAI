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
import { SessionDetails } from "./pages/SessionDetails";
import  Homepage  from "./pages/Homepage";
// import { Dot } from "recharts";
// import { DotPattern } from "./components/magicui/dot-pattern";

function App() {
  const [globalSocket, setGlobalSocket] = useState<Socket | null>(null);
  const googleCliendId = ""
  return (

    <GoogleOAuthProvider clientId={googleCliendId}>
      <AuthProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Homepage />} />
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
<Route path="/session/:id" element={
  <ProtectedRoute>
    <SessionDetails />
  </ProtectedRoute>
} />
{/* <Route path="/a" element={<DotPattern />}/> */}
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
