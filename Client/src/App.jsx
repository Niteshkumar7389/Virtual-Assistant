import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import Customise from "./Pages/Customise";
import { useContext } from "react";
import { userDataContext } from "./context/UserContext";
import HomePage from "./Pages/HomePage";
import Customization from "./Pages/Customization";

const App = () => {
  const { userData, setUserData } = useContext(userDataContext);
  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <HomePage />
          ) : (
            <Navigate to={"/customise"} />
          )
        }
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customise"
        element={userData ? <Customise /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/customization"
        element={userData ? <Customization /> : <Navigate to={"/signup"} />}
      />
    </Routes>
  );
};

export default App;
