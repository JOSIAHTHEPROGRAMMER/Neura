import React, { useState } from 'react';
import Loading from './Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => { 
    const [state, setState] = useState("login");
    const [loading, setLoading] = useState(false);
    const {axios, setToken} = useAppContext()
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    const url = state === "login" ? '/api/user/login' : '/api/user/register';
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
        try {
            const { data } = await axios.post(url, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    } else {
        setErrors(newErrors);
    }
    setLoading(true)
};


    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        
        if (state === "signup" && !formData.name) {
            newErrors.name = "Name is required";
        }
        
        return newErrors;
    };

    const toggleFormState = () => {
        setState(prev => prev === "login" ? "signup" : "login");
        setErrors({});
        setFormData({ name: "", email: "", password: "" });
    };

      if (loading) return <Loading />;

    return (
        <form 
            onSubmit={handleSubmit}
            className="max-w-96 w-full max-h-120 text-center   dark:border-b-primary  border border-gray-300/60 rounded-2xl px-8 bg-transparent shadow-lg"
        >
            <h1 className="text-gray-900 dark:text-primary  text-3xl mt-10 font-semibold">
                {state === "login" ? "Login" : "Sign Up"}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
                {state === "login" ? "Please sign in to continue" : "Create your account to get started"}
            </p>

            {state === "signup" && (
                <div className="flex items-center w-full mt-6 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-[#5445c5] focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="#6B7280"/>
                        <path d="M8 9.5C4.691 9.5 2 11.967 2 15.166C2 15.626 2.373 16 2.833 16H13.167C13.627 16 14 15.626 14 15.166C14 11.967 11.309 9.5 8 9.5Z" fill="#6B7280"/>
                    </svg>
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Full Name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm w-full h-full"
                    />                 
                </div>
            )}
            {errors.name && <p className="text-red-500 text-xs text-left mt-1 ml-6">{errors.name}</p>}

            <div className={`flex items-center w-full ${state === "login" ? "mt-10" : "mt-4"} bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-[#5445c5] focus-within:ring-2 focus-within:ring-indigo-200 transition-all ${errors.email ? 'border-red-500' : ''}`}>
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
                </svg>
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email address" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm w-full h-full"
                    required 
                />                 
            </div>
            {errors.email && <p className="text-red-500 text-xs text-left mt-1 ml-6">{errors.email}</p>}

            <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-[#5445c5] focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
                </svg>
                <input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm w-full h-full"
                    required 
                />                 
            </div>
            {errors.password && <p className="text-red-500 text-xs text-left mt-1 ml-6">{errors.password}</p>}

            {state === "login" && (
                <div className="mt-5 text-left">
                    <a className="text-[#5445c5] text-sm hover:text-[#8024dd] transition-colors" href="#">
                        Forgot password?
                    </a>
                </div>
            )}

            <button 
                type="submit" 
                className="mt-6 w-full h-11 rounded-full text-white bg-[#5445c5] hover:bg-[#8024dd] transition-colors font-medium shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 "
            >
                {state === "login" ? "Login" : "Sign Up"}
            </button>

            <p className="text-gray-500 text-sm mt-4 mb-10">
                {state === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                    type="button"
                    onClick={toggleFormState}
                    className="hover:text-[#8024dd] text-[#5445c5] font-medium transition-colors cursor-pointer"
                >
                    {state === "login" ? "Sign up" : "Login"}
                </button>
            </p>
        </form>
    );
}

export default Login;