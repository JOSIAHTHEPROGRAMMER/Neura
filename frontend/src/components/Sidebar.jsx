import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { FaArrowLeft, FaMoon, FaPlus, FaSearch, FaSun } from "react-icons/fa";
import {
  RiDeleteBin6Line,
  RiGalleryFill,
  RiVipDiamondFill,
  RiLogoutBoxLine
} from "react-icons/ri";
import moment from "moment";
import { assets } from "../assets/dummyData";
import toast from "react-hot-toast";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, axios, setChats, fetchUserChats, setToken, token } =
    useAppContext();
  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    toast.success('you Logged out!')
  }


const deleteChat = async (e, chatId) => {
  try {
    e.stopPropagation();

    const confirmed = window.confirm('Are you sure you want to delete this chat?');
    if (!confirmed) return;

    const { data } = await axios.post(
      '/api/chat/delete',
      { chatId },
      { headers: { Authorization: token } }  
    );

    if (data.success) {

      setChats(prev => prev.filter(chat => chat._id !== chatId));


      await fetchUserChats();

      toast.success(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message); 
  }
};


  return (
    <div
      className={`
        flex flex-col h-screen min-w-72 p-5 
        dark:bg-gradient-to-b from-[#242421]/30 to-black/30 
        border-r border-[#645996]/30 backdrop-blur-3xl 
        transition-all duration-500 ease-in-out
        max-md:absolute left-0 z-10
        ${!isSidebarOpen ? "max-md:-translate-x-full" : "translate-x-0"}
      `}
    >
      {/* Logo + Brand Name */}
      <span className="flex items-center text-4xl font-bold">
        <img
          src={assets.logo}
          alt="Logo"
          className="h-[1em] w-auto inline-block"
        />
        <span>eura</span>
      </span>
      <p className="text-xs opacity-70">Your friendly AI assistant</p>

      {/* New Chat Button */}
      <button onClick={createNewChat} className="flex justify-center items-center gap-2 w-full py-2 mt-10 text-white bg-gradient-to-r from-[#382a9e] to-[#6825ac] text-sm rounded-md cursor-pointer hover:scale-105 transition-transform">
        <FaPlus />
        New Chat
      </button>

      {/* Search Bar */}
      <div className="flex items-center gap-2 p-3 mt-4 border dark:border-white/20 border-gray-300 rounded-md">
        <FaSearch className="w-4 opacity-70" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="text-xs placeholder:text-gray-500 outline-none bg-transparent w-full"
          type="text"
          placeholder="Search Convos"
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}
      <div className="flex-1 overflow-y-auto mt-3 text-sm space-y-3 overflow-x-hidden">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0].content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={String(chat._id)}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsSidebarOpen(false);
              }}
              className="p-2 px-4 dark:bg-[#316a7c]/10 border border-b-gray-400
               dark:border-[#845a9b]/15 
               rounded-md cursor-pointer 
               flex justify-between group
                hover:scale-105 transition-transform "
            >
              <div>
                <p className="truncate w-full ">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 20)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#aea8c4]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>

              <RiDeleteBin6Line onClick={e=>toast.promise(deleteChat(e, chat._id), {loading: 'deleting...'})} className="hidden group-hover:block cursor-pointer " />
            </div>
          ))}
      </div>

      {/* Navigation Buttons */}
      <div
        onClick={() => {
          navigate("/community");
          setIsSidebarOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/15 rounded-md cursor-pointer hover:scale-105 transition-transform"
      >
        <RiGalleryFill className="invert dark:invert-0" />
        <div className="flex flex-col text-sm">
          <p>Community Images</p>
        </div>
      </div>

      <div
        onClick={() => {
          navigate("/credits");
          setIsSidebarOpen(false);
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/15 rounded-md cursor-pointer hover:scale-105 transition-transform"
      >
        <RiVipDiamondFill className="invert dark:invert-0" />
        <div className="flex flex-col text-sm">
          <p>Credits: {user?.credits}</p>
          <p className="text-xs text-gray-400">Purchase more credits</p>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="flex justify-between items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/15 rounded-md hover:scale-105 transition-transform">
        <div className="flex flex-row text-sm ">
          {theme === "dark" ? (
            <FaMoon className="text-yellow-400 text-lg mr-3" />
          ) : (
            <FaSun className="text-yellow-500 mr-3 text-lg" />
          )}
          <p> Mode</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            checked={theme === "dark"}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/15 rounded-md cursor-pointer hover:scale-105 transition-transform">
        <img
          src={assets.pfp}
          className="w-7 h-7 rounded-full border not-dark:border-b-gray-500"
        />
        <div className="flex justify-between flex-row text-sm w-full ">
          <p className="flex text-sm dark:text-primary truncate">
            {user ? user.name : "Login / SignUp"}
          </p>

          {user && (
            <RiLogoutBoxLine onClick={logout} className="cursor-pointer not-dark:text-black  hover:text-primary text-xl" />
          )}
        </div>
      </div>

      {/* Close Sidebar Arrow */}
      <FaArrowLeft
        onClick={() => setIsSidebarOpen(false)}
        className={`
          cursor-pointer md:hidden invert dark:invert-0 
          absolute top-3 right-3
          transition-all duration-500 ease-in-out
          ${
            isSidebarOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-5 pointer-events-none"
          }
        `}
      />
    </div>
  );
};

export default Sidebar;
