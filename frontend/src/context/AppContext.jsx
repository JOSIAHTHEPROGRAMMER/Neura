
import {createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData } from "../assets/dummyData";
import { dummyChats } from "../assets/dummyData";
const AppContext = createContext()

export const AppContextProvider = ({children}) =>{

   const navigate = useNavigate()
   const [user, setUser] = useState(null)
   const [chats, setChats] = useState([])
   const [selectedChat, setSelectedChat] = useState(null)
   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light' ) 
   

   const fetchUser = async () => {
     setUser(dummyUserData)
   }


   const fetchUserChats = async () =>{
            setChats(dummyChats)
            setSelectedChat(dummyChats[2])
   }


   useEffect(()=>{
    if(theme === 'dark'){
        document.documentElement.classList.add('dark');
    } else{
         document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme)
   },[theme])

   useEffect (()=>{
    if(user){
        fetchUserChats()
    } else {
        setChats([])
        setSelectedChat(null)
    }
   },[user])

   useEffect(() => {
    fetchUser()
   },[])

   const value = {
    navigate,user,setChats,selectedChat, setUser, fetchUser, chats,
    setSelectedChat, theme, setTheme
   }
  
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)