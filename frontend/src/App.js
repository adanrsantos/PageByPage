import './App.css';
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Order from "./pages/Order";
import AdminPanel from "./pages/Admin";
import Navbar from "./components/Navbar";
import Create from "./pages/Create";
import Checkout from "./pages/Checkout";

const App = () => {

  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState(null);
  const [admin, setAdmin] = useState(false);

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [navSearch, setNavSearch] = useState("");

  useEffect(() => {
    // Check if there is user data in localStorage
    const storedUserData = localStorage.getItem("user");

    if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        const currentTime = new Date().getTime();
        // Check if the session has expired
        if (parsedUserData.expirationTime > currentTime) {
            // User session is still valid, set user data
            setUserName(parsedUserData.userName);
            setUserID(parsedUserData.userID);
            setAdmin(parsedUserData.admin);
        } else {
            // Session expired, clear localStorage
            localStorage.removeItem("user");
        }
    }
  }, []);

  const handleLogout = () => {
    setUserName("");
    setUserID(null);
    setAdmin(false);
    localStorage.removeItem("user"); // Clear user data on logout
  };

  return (
    <div className="App">
      <BrowserRouter>
        {userID && <Navbar handleLogout={handleLogout} userName={userName} admin={admin} setPosts={setPosts} filter={filter} navSearch={navSearch} setNavSearch={setNavSearch}/>}
        <Routes>
          <Route path="/" element={userID ? <Home userID={userID} posts={posts} setPosts={setPosts} filter={filter} setFilter={setFilter} navSearch={navSearch}/> : <Navigate to="/login"/>}/>
          <Route path="/login" element={userID ? <Navigate to="/"/> : <Login setUserID={setUserID} setUserName={setUserName} setAdmin={setAdmin}/>}/>
          <Route path="/register" element={userID ? <Navigate to="/"/> : <Register />}/>
          <Route path="/cart" element={userID ? <Cart userID={userID}/> : <Navigate to="/login"/>}/>
          <Route path="/create" element={userID ? <Create userID={userID}/> : <Navigate to="/login"/>}/>
          <Route path="/contact" element={userID ? <Contact userID={userID}/> : <Navigate to="/login"/>}/>
          <Route path="/orders" element={userID ? <Order userID={userID}/> : <Navigate to="/login"/>}/>
          <Route path="/checkout" element={userID ? <Checkout userID={userID}/> : <Navigate to="/login"/>}/>
          <Route path="/product/:id" element={userID ? <Product userID={userID}/> : <Navigate to="/login"/>}/>

          <Route path="/admin/*" element={userID ? <AdminPanel userID={userID} userName={userName}/> : <Navigate to="/login"/> } />

          <Route path="*" element={userID ? <Navigate to ="/"/> : <Navigate to="/login"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;