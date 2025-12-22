import { useEffect, useRef, useState } from "react";
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
  const abortControllerRef = useRef(null);
  const isSendingRef = useRef(false);

  
  const stopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isSendingRef.current = false;
    setLoading(false);
    toast("Request stopped");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user) return toast("Login to chat with Neura");
    if (isSendingRef.current) return;

    isSendingRef.current = true;
    setLoading(true);

    const promptCopy = prompt;
    setPrompt("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: promptCopy,
        timestamp: Date.now(),
        isImage: false,
      },
    ]);

    abortControllerRef.current = new AbortController();

    try {
      const { data } = await axios.post(
        `/api/message/${mode}`,
        {
          chatId: selectedChat._id,
          prompt: promptCopy,
          isPublished,
        },
        {
          headers: { Authorization: token },
          signal: abortControllerRef.current.signal,
        }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.reply]);

        setUser((prev) => ({
          ...prev,
          credits: prev.credits - (mode === "image" ? 15 : 3),
        }));
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Request aborted");
      } else {
        toast.error(error.message);
      }
    } finally {
      abortControllerRef.current = null;
      isSendingRef.current = false;
      setLoading(false);
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
  }, [messages]);

  return (
    <div className="relative flex flex-col h-full ml-5 md:ml-20 xl:ml-40 mr-0 max-md:mt-14">
      {/* MESSAGE AREA */}
      <div
        ref={scrollRef}
        className={`flex-1 ${
          messages.length === 0 ? "overflow-hidden" : "overflow-y-auto"
        } px-2 pb-32`}
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col mt-60 items-center justify-center gap-3 dark:text-amber-50">
            <span className="flex items-center text-7xl font-bold">
              <img src={assets.logo} className="h-[1em]" />
              <span>eural</span>
            </span>
            <p className="mt-1 text-4xl sm:text-5xl text-center text-gray-400">
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

      {/* INPUT BAR */}
      <div className="w-full bg-transparent fixed bottom-5 left-40 flex justify-center">
        <div className="pointer-events-auto w-[80%] max-w-3xl">
          {mode === "image" && (
            <label className="inline-flex ml-60 items-center gap-2 mb-3 text-sm mx-auto">
              <p className="text-xs">Publish Image to Community</p>
              <input
                onChange={(e) => setIsPublished(e.target.checked)}
                type="checkbox"
                checked={isPublished}
              />
            </label>
          )}

          <form
            onSubmit={onSubmit}
            className="flex items-center bg-primary/5 border border-primary/30 rounded-full px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-primary transition"
          >
            <select
              onChange={(e) => setMode(e.target.value)}
              value={mode}
              className="hidden sm:block text-sm rounded-md bg-transparent px-2 py-1 outline-none text-primary cursor-pointer"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>

            <input
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              type="text"
              placeholder="Ask anything..."
              className="flex-1 text-sm bg-transparent outline-none text-primary px-3"
              required
              disabled={loading}
            />

            <button
              type="button"
              onClick={loading ? stopRequest : onSubmit}
              className="p-2 rounded-full hover:bg-primary/10 transition-colors text-primary cursor-pointer"
            >
              {loading ? <IoStopCircle size={20} /> : <IoSendSharp size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
