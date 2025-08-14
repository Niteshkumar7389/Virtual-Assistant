import React, { useContext } from "react";
import { useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Customization = () => {
  const navigate = useNavigate();
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );

  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );

      console.log(result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-sky-400 flex justify-center items-center flex-col relative">
      <IoMdArrowRoundBack
        className="absolute h-8 w-8 top-7 left-8 text-white "
        onClick={() => navigate("/customise")}
      />
      <h1 className="text-white text-2xl font-semibold text-center mb-5">
        Enter Your{" "}
        <span className="text-sky-200 text-center text-2xl font-semibold">
          Assistant Name
        </span>
      </h1>
      <input
        type="text"
        className="w-full max-w-xl h-14 outline-none bg-transparent border-2 border-white text-white text-md placeholder-gray-300 px-5 rounded-full mt-8"
        placeholder="Enter your Assistant name.."
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className="w-35 h-15 lg:w-50 lg:h-15 bg-gradient-to-l from-pink-600 to-sky-600 text-black text-xl rounded-full font-semibold mt-5"
          onClick={() => {
            handleUpdateAssistant();
          }}
        >
          Create
        </button>
      )}
    </div>
  );
};

export default Customization;
