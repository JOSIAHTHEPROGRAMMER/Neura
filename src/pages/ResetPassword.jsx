import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Loading from './Loading';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`/api/user/reset-password/${token}`, { newPassword });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }

    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="dark:text-amber-50 h-screen w-screen flex justify-center text-gray-500 dark:bg-gradient-to-b from-[#1b1a23] to-[#000000]">
      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="max-w-96 w-full max-h-120 text-center border border-gray-300/60 rounded-2xl px-8 bg-transparent shadow-lg"
        >
          <h1 className="text-gray-900 text-3xl mt-10 font-semibold">
            Reset Password
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter your new password
          </p>

          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-transparent w-full outline-none text-sm h-full text-gray-950 dark:placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="mt-6 mb-6 w-full h-11 rounded-full text-white bg-[#5445c5] hover:bg-[#8024dd] transition-colors font-medium shadow-md cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
