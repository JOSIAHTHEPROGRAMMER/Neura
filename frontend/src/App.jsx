import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatBox from "./components/ChatBox";
import { Route, Routes, useLocation } from "react-router-dom";
import Credit from "./pages/Credits";
import Community from "./pages/Community";
import { FaArrowLeft } from "react-icons/fa";
import './assets/prism.css'
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import { useAppContext } from "./context/AppContext";
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {pathname } = useLocation()

  const {user} = useAppContext()


  if(pathname === '/loading') return <Loading/>

  return (
    <>
      {/* Open Sidebar Arrow (outside) */}

      {user ? ( <div
        className={`
          absolute top-3 left-3 md:hidden z-20
          transition-all duration-500 ease-in-out
          ${isSidebarOpen ? "opacity-0 -translate-x-5 pointer-events-none" : "opacity-100 translate-x-0"}
        `}
      >
        <FaArrowLeft
          className="cursor-pointer invert dark:invert-0 text-amber-50"
          onClick={() => setIsSidebarOpen(true)}
        />
      </div>) : <p></p>}
     


      {user ? (  
        
        
        
        
        <div className="dark:text-amber-50 text-gray-500 dark:bg-gradient-to-b from-[#1b1a23] to-[#000000]">
        <div className="flex h-screen w-screen">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credit />} />
            <Route path="/community" element={<Community />} />
          
          </Routes>
        </div>
      </div>) : (
           
           <div className="dark:text-amber-50 h-screen w-screen flex justify-center
             text-gray-500 dark:bg-gradient-to-b
              from-[#1b1a23] to-[#000000]">
             <div className="min-h-screen flex items-center justify-center">

              <Login/>

              </div>
           </div>

      )}

   
    </>
  );
};

export default App;

