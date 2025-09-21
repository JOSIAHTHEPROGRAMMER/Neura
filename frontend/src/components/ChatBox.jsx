import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/dummyData";
import Message from "./Message";
import { IoStopCircle, IoSendSharp } from "react-icons/io5";
import toast from "react-hot-toast";

const ChatBox = () => {
  const { selectedChat, user, axios, setUser, token } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);
  const scrollRef = useRef(null);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) {
        return toast("Login to chat with Neura");
      }
      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timeStamp: Date.now(),
          isImage: false,
        },
      ]);

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedChat._id, prompt, isPublished },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);

        if(mode === 'image'){
          setUser(prev=>({...prev, credits: prev.credits - 15}))
        } else {
            setUser(prev=>({...prev, credits: prev.credits - 3}))
        }


       // toast.success(data.message);
      } else{
          toast.error(data.message);
          setPrompt(promptCopy)

      }



    } catch (error) {

        toast.error(error.message);

    } finally{
      setPrompt('')
      setLoading(false)
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
      });
    }
  },[messages]);

  return (
    <div className="flex-1 flex flex-col justify-between ml-5 md:ml-20 xl:ml-40 mr-0 max-md:mt-14">
      <div ref={scrollRef} className="flex-1 mb-5 overflow-y-auto">
        {messages.length === 0 && (
          <div
            className="h-full  flex flex-col items-center justify-center 
                  gap-3 text-amber-50 not-dark:text-neutral-500
                  "
          >
            <span className="flex items-center text-7xl font-bold">
              <img
                src={assets.logo}
                alt="Logo"
                className="h-[1em] w-auto inline-block"
              />
              <span>eural</span>
            </span>

            <p
              className="mt-1 text-4xl
                    sm:text-5xl
                    text-center
                    text-gray-400
                    dark:text-amber-50  
                    "
            >
              Ask something...
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5 mt-10">
            <div className="dot w-2 h-2 rounded-full bg-sky-950 dark:bg-amber-50"></div>
            <div className="dot w-2 h-2 rounded-full bg-sky-950 dark:bg-amber-50"></div>
            <div className="dot w-2 h-2 rounded-full bg-sky-950 dark:bg-amber-50"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Image to Community</p>
          <input
            onChange={(e) => setIsPublished(e.target.checked)}
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
          />
        </label>
      )}

      {/* prompt input box */}
      <form
        onSubmit={onSubmit}
        className="flex items-center bg-primary/5 border border-primary/30 rounded-full px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-primary transition w-[80%] mb-5 max-w-3xl mx-auto"
      >
        {/* Mode select */}
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="hidden sm:block text-sm rounded-md bg-transparent px-2 py-1 outline-none text-primary"
        >
          <option className="dark:bg-primary/20" value="text">
            Text
          </option>
          <option className="dark:bg-primary/20" value="image">
            Image
          </option>
        </select>

        {/* Text input */}
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="Ask anything..."
          className="flex-1 text-sm bg-transparent outline-none text-primary placeholder:text-primary/60 px-3"
          required
        />

        <button
          className="p-2 rounded-full hover:bg-primary/10 transition-colors text-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? <IoStopCircle size={20} /> : <IoSendSharp size={20} />}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
