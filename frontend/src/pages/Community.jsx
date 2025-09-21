import React, { useEffect, useState } from 'react'
import Loading from "./Loading";
import { FocusCards } from '../components/ui/focus-cards';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Community = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const {axios} = useAppContext()

 const fetchImages = async () => {
  try {
    const { data } = await axios.get('/api/user/published')
    if (data.success) {
      const cardsWithId = data.images.map(card => ({
        ...card,
        _id: crypto.randomUUID() 
      }));
      setImages(cardsWithId);
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error(error.message)
  }
  setLoading(false)
}


  useEffect(() => {
    fetchImages()  
  }, [])

  if (loading) return <Loading/>

  return (
    <div className='flex flex-col h-full mx-auto w-full 2xl:px-20 xl:px-12 p-6 pt-12 overflow-y-auto'>
      <h2 className='text-2xl font-bold dark:text-white not-dark:invert mb-6 justify-center 
      items-center flex '>
        Community Images
      </h2>

      {images.length > 0 ? (
         <FocusCards cards={images} />
       
      ) : (
        <p>Nothing to see here folks...</p>
      )}
    </div>
  )
}

export default Community
