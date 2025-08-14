import React from "react";
import Card from "../components/Card";
import { MdCloudUpload } from "react-icons/md";
import img1 from "../assets/bg.jpg";
import img2 from "../assets/bGImage.jpg";
import img3 from "../assets/BG.png";
import img4 from "../assets/background.jpg";
import img5 from "../assets/Bg1.jpg";
import { useState } from "react";
import { useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Customise = () => {
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

  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-sky-400 flex justify-center items-center flex-col ">
      <h1 className="text-white text-2xl font-semibold text-center mb-5">
        Select Your{" "}
        <span className="text-sky-200 text-center text-2xl font-semibold">
          Assistant Image
        </span>
      </h1>
      <div className="w-10/12 max-w-7/12 flex flex-wrap items-center justify-center  gap-4 ">
        <Card image={img1} />
        <Card image={img2} />
        <Card image={img3} />
        <Card image={img4} />
        <Card image={img5} />
        <Card image={img1} />
        <div
          className={`w-16 h-32 lg:w-45 lg:h-55 bg-sky-500 border-2 border-sky-500 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-sky-300 hover:border-3 hover:border-white flex items-center justify-center cursor-pointer ${
            selectedImage == "input" ? "border-4 border-white shadow-2xl" : null
          }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <MdCloudUpload className="w-10 h-10 text-white " />
          )}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={inputImage}
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <button
          className="w-35 h-15 lg:w-50 lg:h-15 bg-gradient-to-l from-pink-600 to-sky-600 text-black text-xl rounded-full font-semibold mt-5"
          onClick={() => navigate("/Customization")}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Customise;
