import React from "react";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContent } from "../context/appContext";

const Header = () => {
  const { userData } = useContext(AppContent);

  return (
    <>
      <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
        <img
          src={assets.header_img}
          className="w-36 h-36 rounded-full"
          alt=""
        />
        <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
          Hey {userData ? userData.name : "Guest"} Developer
          <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
        </h1>
        <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
          Welcome our app
        </h2>
        <p className="mb-8 max-w-md">
          Lets start a quick product tour and we will have you!
        </p>
        <button className="border border-gray-500 rounded-full px-8 py-2 hover:bg-gray-200 transition-all">
          Get Started
        </button>
      </div>
    </>
  );
};

export default Header;
