// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import EmailVerify from "./pages/EmailVerify";
// import ResetPassword from "./pages/ResetPassword";
// const App = () => {
//   return (
//     <>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/email-verify" element={<EmailVerify />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//       </Routes>
//     </>
//   );
// };

// export default App;

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import { ToastContainer, toast } from "react-toastify";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/email-verify",
    element: <EmailVerify />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

const App = () => {
  return (
    <>
      <main>
        <ToastContainer />
        <RouterProvider router={router}></RouterProvider>
      </main>
    </>
  );
};

export default App;
