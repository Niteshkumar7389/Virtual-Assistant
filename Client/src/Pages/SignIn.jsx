import React, { useContext, useState } from "react";
import axios from "axios";
import bg from "../assets/bg.jpg";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { serverUrl, userData, setUserData } = useContext(userDataContext);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setUserData(null);
      setErr(error.response.data.message);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000000] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20]px] px-5 "
        action=""
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-3xl font-semibold mb-8">
          Login for <span className="text-sky-300">Virtual Assistance</span>
        </h1>
        <input
          type="email"
          className="w-full h-14 outline-none bg-transparent border-2 border-white text-white text-md placeholder-gray-300 px-5 rounded-full mb-8"
          placeholder="Email address"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="relative w-full h-14 outline-none bg-transparent border-2 border-white text-white rounded-full mb-8">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full h-full outline-none bg-transparent  text-white text-md placeholder-gray-300 px-5 rounded-full mb-8"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword && (
            <IoEyeOutline
              onClick={() => setShowPassword(true)}
              className="absolute top-3 right-5 w-7 h-7 cursor-pointer"
            />
          )}
          {showPassword && (
            <IoEyeOffOutline
              onClick={() => setShowPassword(false)}
              className="absolute top-3 right-5 w-7 h-7 cursor-pointer"
            />
          )}
        </div>
        {err.length > 0 && (
          <p className="text-red-500 text-xl mb-3 font-semibold">*{err}</p>
        )}
        <button className="w-full h-14 bg-gradient-to-l from-pink-600 to-sky-600 text-black text-xl rounded-full font-semibold">
          Login
        </button>
        <p className="mt-4 text-white text-lg font-semibold ">
          Don't have an account ?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-pink-600 text-lg font-semibold cursor-pointer"
          >
            SignUp here
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
