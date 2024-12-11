import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

//components
import Login from "./components/pages/login";
import Signup from "./components/pages/signup";
import Home from "./components/pages/home";
import NavBar from "./components/navBar";
import { UserProvider, UserContext } from "./context/userContext";
import { useEffect, useContext } from "react";
import axios from "axios";
import CreatePost from "./components/pages/createPost";
import Blog from "./components/pages/Blog";
import UpdateBlog from "./components/pages/updateBlog";
import { About } from "./components/pages/About";
import { Contact } from "./components/pages/Contact";
import Loader from "./components/Loader";

// toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { setUser, setIsAuthenticated } = useContext(UserContext);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(
          "https://blogifybackend-anmol-ramolas-projects.vercel.app/userData",
          {
            withCredentials: true,
          }
        );

        if (!res) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        if (res.status === 200) {
          setUser(res.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        console.log(error);
      }
    };
    getUserData();
  }, [setUser, setIsAuthenticated]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/update/:id" element={<UpdateBlog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="loader" element={<Loader />} />
      </Routes>
    </BrowserRouter>
  );
}

function WrappedApp() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}

export default WrappedApp;
