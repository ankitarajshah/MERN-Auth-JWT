import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/appContext";
import { toast } from "react-toastify";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContent);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/logout`);
      if (response.data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success("Logged out successfully!");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const sendVerificationOTP = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );
      console.log("send", response);
      if (response.data.success) {
        navigate("/email-verify");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message); // Fixed this line
      }
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
        <img src={assets.logo} alt="" className="w-28" />
        {userData ? (
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group ">
            {userData.name?.[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-full right-0 z-10 text-black rounded pt-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOTP}
                    className="py-1 px-2 hover:bg-gray-400 cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}

                <li
                  onClick={handleLogout}
                  className="py-1 px-2 hover:bg-gray-400 cursor-pointer pr-10"
                >
                  Log out
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border border-gray-500 rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-all"
            >
              Login <img src={assets.arrow_icon} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
