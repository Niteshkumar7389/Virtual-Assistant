import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import AiImg from "../assets/AI.gif";
import userImg from "../assets/user.gif";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const HomePage = () => {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [hamburger, setHamburger] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizing = useRef(false);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      localStorage.removeItem("token");
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizing.current) {
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (error) {
        if (!error.message.includes("start")) {
          console.error("Recognition error:", error);
        }
      }
    }
  };
  //text to speech so that assisatnt talk
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  //speech to text
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Start error :", error);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };
    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
            } catch (error) {
              if (error.name !== "InvalidStateError")
                console.error("Start error :", error);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
            } catch (error) {
              if (error.name !== "InvalidStateError")
                console.error("Start error :", error);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const voice = e.results[e.results.length - 1][0].transcript.trim();

      if (voice.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        setUserText(voice);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(voice);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, what can i do for you?`
    );
    greeting.lang = "hi-IN";

    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "calculator_open") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }
    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-sky-400 flex justify-center items-center flex-col overflow-hidden">
      <IoIosMenu
        className="absolute lg:hidden w-6 h-6 top-7 right-8 text-white"
        onClick={() => setHamburger(true)}
      />
      <div
        className={`absolute lg:hidden top-0 w-full h-full bg-[#00003500] backdrop-blur-lg p-6 flex flex-col gap-5 items-start transition-transform ${
          hamburger ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <RxCross2
          className="absolute lg:hidden w-6 h-6 top-7 right-8 text-white"
          onClick={() => setHamburger(false)}
        />
        <button
          className="w-35 h-15 lg:w-50 lg:h-15 bg-gradient-to-l from-pink-200 to-sky-300  text-black text-xl rounded-full font-semibold "
          onClick={() => handleLogout()}
        >
          Logout
        </button>
        <button
          className="w-70 h-15 lg:w-50 lg:h-15 bg-gradient-to-l from-pink-200 to-sky-300 text-black text-xl rounded-full font-semibold"
          onClick={() => navigate("/customise")}
        >
          Customize your Assistant
        </button>
        <div className="w-full h-1 bg">
          <h1 className="text-black font-semibold text-xl mb-5">History</h1>
          <div className="h-80 w-full gap-5 overflow-y-auto flex flex-col truncate">
            {userData.history?.map((history, index) => (
              <span key={index} className="text-gray-400 text-lg w-full">
                {history}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button
        className="w-35 h-15 lg:w-50 lg:h-15 bg-gradient-to-l from-pink-200 to-sky-300  text-black text-xl rounded-full font-semibold mt-5 absolute top-8 right-10 hidden lg:block"
        onClick={() => handleLogout()}
      >
        Logout
      </button>
      <button
        className="w-35 h-15 lg:w-50 lg:h-15 bg-gradient-to-l from-pink-200 to-sky-300 text-black text-xl rounded-full font-semibold mt-5 absolute top-35 right-10 hidden lg:block"
        onClick={() => navigate("/customise")}
      >
        Customize your Assistant
      </button>
      <h1 className="text-white font-bold mb-6 text-3xl">
        Hi I'm {userData?.assistantName}
      </h1>
      <div className="w-75 h-80 flex justify-center items-center overflow-hidden rounded-4xl">
        <img
          src={userData?.assistantImage}
          alt="image"
          className="h-full object-cover"
        />
      </div>
      {!aiText && <img src={AiImg} className="w-70 bg-transparent mt-4" />}
      {aiText && <img src={userImg} className="w-70 bg-transparent mt-4" />}
      <h1 className="text-white mb-4 text-md font-bold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};

export default HomePage;
