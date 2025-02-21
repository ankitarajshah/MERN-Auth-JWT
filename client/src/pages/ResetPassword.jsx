import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AppContent } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { backendUrl } = useContext(AppContent);

  const [isEmaiSent, setIsEmailSent] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSumitted, setIsOtpSubmitted] = useState(false);

  // Form for email verification
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isSubmitting: isSubmittingEmail },
  } = useForm();

  // Form for OTP verification
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    setValue,
    formState: { errors: otpErrors, isSubmitting: isSubmittingOtp },
  } = useForm();

  // Form for password reset
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm();

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

  const onSubmitEmail = async (data) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email: data.email }
      );
      setEmail(data.email);
      setIsEmailSent(true);
      toast.success("Verification email sent!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send verification email.");
    }
  };
  const onSubmitOtp = async (data) => {
    console.log({ data });
    const otp = Array.from({ length: 6 })
      .map((_, index) => data[`otp${index}`] || "")
      .join("");
    console.log({ otp });
    setOtp(otp);
    setIsOtpSubmitted(true);
    // try {
    //   const response = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
    //     email,
    //     otp: enteredOtp,
    //   });

    //   if (response.data.success) {
    //     setOtp(otp); // Store OTP for password reset
    //     setIsOtpSubmitted(true);
    //     toast.success("OTP Verified!");
    //   } else {
    //     toast.error(response.data.message);
    //   }
    // } catch (error) {
    //   toast.error("OTP verification failed.");
    // }
  };

  const onSubmitPassword = async (data) => {
    console.log({ data });

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp,
          newPassword: data.password,
        }
      );
      console.log(response);
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      console.error("Password Reset Error:", error);
      toast.error("Failed to reset password.");
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt=""
          className="absolute left-5 sm:left-20 w-28 sm:w-32 cursor-pointer"
        />
        {/* enter email */}
        {!isEmaiSent && (
          <form
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
            onSubmit={handleSubmitEmail(onSubmitEmail)}
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Reset Password
            </h1>
            <p className="text-center mb-6 text-indigo-400">
              Enter your registered email address
            </p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
              <img src={assets.mail_icon} alt="" />
              <input
                className="bg-transparent outline-none"
                type="email"
                placeholder="Email Id"
                {...registerEmail("email", {
                  required: "Email is required",
                })}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingEmail}
              className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-800 text-white font-medium"
            >
              {isSubmittingEmail ? "Sending..." : "Submit"}
            </button>
          </form>
        )}

        {/* Otp form */}

        {!isOtpSumitted && isEmaiSent && (
          <form
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
            onSubmit={handleSubmitOtp(onSubmitOtp)}
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
                    {...registerOtp(`otp${index}`, { required: true })}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
            </div>
            <button
              type="submit"
              disabled={isSubmittingOtp}
              className="w-full py-2 rounded-full bg-indigo-500 text-white"
            >
              {isSubmittingOtp ? "Verifying..." : "Submit"}
            </button>
          </form>
        )}
        {isOtpSumitted && isEmaiSent && (
          <form
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
            onSubmit={handleSubmitPassword(onSubmitPassword)}
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              New Password
            </h1>
            <p className="text-center mb-6 text-indigo-400">
              Enter your registered email address
            </p>
            <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-[#333A5C]">
              <img src={assets.lock_icon} alt="Lock Icon" />
              <input
                type="password"
                placeholder="New Password"
                {...registerPassword("password", {
                  required: "Password is required",
                })}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="w-full py-2 rounded-full bg-indigo-500 text-white"
            >
              {isSubmittingPassword ? "Resetting..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
