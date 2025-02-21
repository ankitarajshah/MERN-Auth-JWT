import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log({ data });
    const payload = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
    };

    try {
      if (state === "Sign Up") {
        if (!data.firstName || !data.lastName) {
          toast.error("First Name and Last Name are required");
          return;
        }
        if (!data.confirmPassword || data.password !== data.confirmPassword) {
          toast.error("Passwords do not match or are empty");
          return;
        }
        const response = await axios.post(
          `${backendUrl}/api/auth/register`,
          payload
        );
        console.log("Registration Successful:", response.data);
        if (response.data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        if (state === "Login") {
          const response = await axios.post(
            `${backendUrl}/api/auth/login`,
            data,
            { withCredentials: true }
          );
          console.log("Login Successful:", response.data);
          if (response.data.success) {
            setIsLoggedIn(true);
            getUserData();
            navigate("/");
          } else {
            toast.error(data.message);
          }
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
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
        <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
          <h2 className="text-3xl font-semibold text-white text-center mb-3">
            {state === "Sign Up" ? "Create Acount" : "Login "}
          </h2>
          <p className="text-center text-sm mb-2">
            {state === "Sign Up"
              ? "Create your account"
              : "Login to your account"}
          </p>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {state === "Sign Up" && (
              <>
                <div className="mb-4">
                  <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
                    <img src={assets.person_icon} alt="" />
                    <input
                      className="bg-transparent outline-none"
                      type="text"
                      placeholder="First Name"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                    />
                  </div>

                  {errors.firstName && (
                    <p className="text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
                    <img src={assets.person_icon} alt="" />
                    <input
                      className="bg-transparent outline-none"
                      type="text"
                      placeholder="Last Name"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </>
            )}
            <div className="mb-4">
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} alt="" />
                <input
                  className="bg-transparent outline-none"
                  type="email"
                  placeholder="Email Id"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-4">
              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} alt="" />
                <input
                  className="bg-transparent outline-none"
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            {state === "Sign Up" && (
              <div className="mb-4">
                <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-[#333A5C]">
                  <img src={assets.lock_icon} alt="Lock Icon" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="bg-transparent outline-none w-full"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
            <p
              onClick={() => {
                navigate("/reset-password");
              }}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot password?
            </p>
            <button className="w-full py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-800 text-white font-medium">
              {state}
            </button>
          </form>
          {state === "Sign Up" ? (
            <p className="text-gray-400 text-center text-xs mt-4">
              Already have an account?{"   "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-400 cursor-pointer underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-400 text-center text-xs mt-4">
              Dont have an account?{"   "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-400 cursor-pointer underline"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
