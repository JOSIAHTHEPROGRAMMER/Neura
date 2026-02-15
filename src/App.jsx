import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ChatBox from "./components/ChatBox";
import Credit from "./pages/Credits";
import Community from "./pages/Community";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import "./assets/prism.css";

import { useAppContext } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectRoute";

const App = () => {
  const { pathname } = useLocation();
  const { user, loadingUser } = useAppContext();

  // Global loading screen
  if (pathname === "/loading" || loadingUser) return <Loading />;

  return (
    <>
      <Toaster />

      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ========== PROTECTED ROUTES ========== */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <ChatBox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/credits"
          element={
            <ProtectedRoute user={user}>
              <Credit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute user={user}>
              <Community />
            </ProtectedRoute>
          }
        />

        {/* ========== CATCH-ALL ========== */}
        <Route
          path="*"
          element={
            <Navigate to={user ? "/" : "/login"} replace />
          }
        />
      </Routes>
    </>
  );
};

export default App;
