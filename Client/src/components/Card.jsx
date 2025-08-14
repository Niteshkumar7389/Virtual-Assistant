import React from "react";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Card = ({ image }) => {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  return (
    <div
      className={`w-16 h-32 lg:w-45 lg:h-55 bg-blue-600 border-2 border-sky-500 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-sky-300 hover:border-3 hover:border-white cursor-pointer ${
        selectedImage == image ? "border-4 border-white shadow-2xl" : null
      }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} alt="assistantImage" className="h-full object-cover" />
    </div>
  );
};

export default Card;
