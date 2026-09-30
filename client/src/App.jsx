import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <Routes>
          {/* Public Routees */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* 404 Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Login />
    </div>
  );
};

export default App;
