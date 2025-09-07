import React, { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "https://virtual-assistant-backend-ixzt.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      if (result.data && result.data._id) {
      setUserData(result.data);
    } else {
      setUserData(null);
    }
  } catch (error) {
    console.log(error);
    setUserData(null);
  }
};

  //assistant in frontend
  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/voiceassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) { 
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
};
export default UserContext;
