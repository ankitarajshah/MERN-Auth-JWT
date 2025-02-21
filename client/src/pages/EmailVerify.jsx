import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";

import { AppContent } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, getUserData, isLoggedIn, userData } =
    useContext(AppContent);

  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm();

  const inputRefs = useRef([]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue(`otp${index}`, value);
    console.log({ value });
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (
      !/^[0-9]$/.test(e.key) &&
      !["Backspace", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault(); // Block non-numeric keys
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .slice(0, 6)
      .replace(/\D/g, ""); // Take only first 6 digits
    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        setValue(`otp${index}`, char); // Ensure React Hook Form updates state
      }
    });
    inputRefs.current[Math.min(5, paste.length - 1)]?.focus(); // Move focus to last filled input
  };

  const onSubmit = async (data) => {
    console.log("Submitted Data:", data);
    // Ensure correct order of OTP digits
    const otp = Array.from({ length: 6 })
      .map((_, index) => data[`otp${index}`] || "")
      .join("");
    console.log({ otp });
    if (otp.length !== 6) {
      for (let i = 0; i < 6; i++) {
        setError(`otp${i}`, { message: "Enter the full 6-digit OTP" });
      }
      return;
    }
    clearErrors();

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        getUserData();
        navigate("/");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setError("otp0", { message: "Server error. Please retry!" });
    }
  };
  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, userData?.isAccountVerified, navigate]);
  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt=""
          className="absolute left-5 sm:left-20 w-28 sm:w-32 cursor-pointer"
        />
        <form
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Email verify OTP
          </h1>
          <p className="text-center mb-6 text-indigo-400">
            Enter 6-digit code sent to your email id
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  // required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  {...register(`otp${index}`, { required: true })}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            {errors.otp0 && (
              <p className="text-red-500">{errors.otp0.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-md text-white bg-indigo-500 hover:bg-indigo-600 transition-all"
          >
            {isSubmitting ? "Verifying..." : Verify}
          </button>
        </form>
      </div>
    </>
  );
};

export default EmailVerify;
