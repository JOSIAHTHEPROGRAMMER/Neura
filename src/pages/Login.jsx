import { useState } from 'react';
import Loading from './Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [formState, setFormState] = useState("login"); // "login" | "signup" | "forgot"
  const [loading, setLoading] = useState(false);
  const { axios, setToken } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (formState === "login" || formState === "signup" || formState === "forgot") {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    }
    if (formState === "login" || formState === "signup") {
      if (!formData.password && formState === "login") newErrors.password = "Password is required";
      if (!formData.name && formState === "signup") newErrors.name = "Name is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      let url = '';
      let payload = {};

      switch(formState) {
        case "login":
          url = '/api/user/login';
          payload = { email: formData.email, password: formData.password };
          break;
        case "signup":
          url = '/api/user/register';
          payload = { name: formData.name, email: formData.email, password: formData.password };
          break;
        case "forgot":
          url = '/api/user/forgot-password';
          payload = { email: formData.email };
          break;
      }

      const { data } = await axios.post(url, payload);

      if (data.success) {
        toast.success(data.message);
        if (formState === "login"   || formState === "signup"  ) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
        } else if (formState === "forgot") {
    
          toast.success("Check your email for the password reset link!");
        }
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
    <div className="dark:text-amber-50 h-screen w-screen flex justify-center  text-gray-500 dark:bg-gradient-to-b from-[#1b1a23] to-[#000000]">
      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="max-w-96 w-full max-h-120 text-center border border-gray-300/60 rounded-2xl px-8 bg-transparent shadow-lg"
        >
          <h1 className="text-gray-900 dark:text-amber-50 text-3xl mt-10 font-semibold">
            {formState === "login" ? "Login" :
             formState === "signup" ? "Sign Up" :
             "Forgot Password"}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {formState === "login" && "Please sign in to continue"}
            {formState === "signup" && "Create your account to get started"}
            {formState === "forgot" && "Enter your email to reset password"}
          </p>

          {formState === "signup" && (
            <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-transparent w-full outline-none text-sm h-full text-gray-950 dark:placeholder-gray-400"
              />
            </div>
          )}
          {errors.name && <p className="text-red-500 text-xs text-left mt-1">{errors.name}</p>}

          <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-transparent w-full outline-none text-sm h-full text-gray-950 dark:placeholder-gray-400"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs text-left mt-1">{errors.email}</p>}

          {(formState === "login" || formState === "signup") && (
            <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full pl-6 gap-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-transparent w-full outline-none text-sm h-full text-gray-950 dark:placeholder-gray-400"
              />
            </div>
          )}
          {errors.password && <p className="text-red-500 text-xs text-left mt-1">{errors.password}</p>}

          {formState === "login" && (
            <div className="mt-5 text-left">
              <button
                type="button"
                className="text-[#5445c5] text-sm hover:text-[#8024dd] transition-colors cursor-pointer"
                onClick={() => setFormState("forgot")}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full h-11 rounded-full text-white cursor-pointer bg-[#5445c5] hover:bg-[#8024dd] transition-colors font-medium shadow-md"
          >
            {formState === "login" ? "Login" :
             formState === "signup" ? "Sign Up" :
             "Send Reset Link"}
          </button>

          <p className="text-gray-500 text-sm mt-4 mb-10">
            {formState === "login" ? "Don't have an account? " :
             formState === "signup" ? "Already have an account? " : ""}
            {(formState === "login" || formState === "signup") && (
              <button
                type="button"
                onClick={() => setFormState(formState === "login" ? "signup" : "login")}
                className="hover:text-[#8024dd] text-[#5445c5] font-medium transition-colors cursor-pointer"
              >
                {formState === "login" ? "Sign up" : "Login"}
              </button>
            )}
            {formState === "forgot" && (
              <button
                type="button"
                onClick={() => setFormState("login")}
                className="hover:text-[#8024dd] text-[#5445c5] font-medium transition-colors cursor-pointer flex flex-row"
              >
                <FaArrowLeft className='W-5 h-5  justify-center ml-15 mr-2  ' /> Back to Login
              </button>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
