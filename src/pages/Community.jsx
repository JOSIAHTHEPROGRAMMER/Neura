import { useEffect, useState } from "react";
import Loading from "./Loading";
import { FocusCards } from "../components/ui/focus-cards";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";

const Community = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  const { axios } = useAppContext();

  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/user/published");
      if (data.success) {
        console.log(data);
        const cardsWithId = data.images.map((card) => ({
          ...card,
          _id: crypto.randomUUID(),
        }));
        setImages(cardsWithId);
        setFilteredImages(cardsWithId);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const query = input.toLowerCase();

    const filtered = images.filter((img) =>
      img.userName.toLowerCase().includes(query),
    );

    setFilteredImages(filtered);
  }, [input, images]);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto flex h-full w-full flex-col overflow-y-auto p-6 pt-12 xl:px-12 2xl:px-20">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-4xl font-bold text-black/40 dark:text-white">
          Community Images
        </h2>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search here..."
            className="w-full rounded-md border border-gray-700 bg-white px-3 py-2 pl-9 text-sm text-black
                       dark:border-gray-600 dark:bg-black/40 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Content */}
      {filteredImages.length > 0 ? (
        <FocusCards cards={filteredImages} />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nothing to see here folks...
        </p>
      )}
    </div>
  );
};

export default Community;
