import { Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { FaArrowLeft } from "react-icons/fa";


/*
  - Redirects to login if no user
  - Wraps authenticated pages inside ProtectedLayout
*/
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return <ProtectedLayout>{children}</ProtectedLayout>;
};


/*
  - Handles sidebar open/close
  - Global styling wrapper for authenticated pages
*/
const ProtectedLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dark:text-amber-50 text-gray-500 dark:bg-gradient-to-b from-[#1b1a23] to-[#000000]">
      <div
        className={`
          absolute top-3 left-3 md:hidden z-20
          transition-all duration-500 ease-in-out
          ${isSidebarOpen ? "opacity-0 -translate-x-5 pointer-events-none"
                          : "opacity-100 translate-x-0"}
        `}
      >
        <FaArrowLeft
          className="cursor-pointer invert dark:invert-0 text-amber-50"
          onClick={() => setIsSidebarOpen(true)}
        />
      </div>

      <div className="flex h-screen w-screen">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
