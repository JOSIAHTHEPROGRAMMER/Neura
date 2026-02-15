import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoaderFour} from '../components/ui/loader';
import { useAppContext } from '../context/AppContext';

const Loading = () => {
  const navigate = useNavigate();
  const {fetchUser} = useAppContext()

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser()
      navigate('/');
    }, 8001);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-b dark:from-[#1b1a23] dark:to-[#000000] from-[#c1c0c9] to-[#f5f5f6] ">
      <LoaderFour />
    </div>
  );
};

export default Loading;
