import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AppContent = createContext();
import { toast } from "react-toastify";

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      console.log({ response, userData });
      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        toast.error(response.data.message);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.message);
    }
  };
  console.log({ userData });
  const getAuthState = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      toast.error(error.response?.data?.message || error.message);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
