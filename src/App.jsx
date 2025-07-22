import React from "react";
import Menubar from "./components/MenuBar/Menubar";
import { Route, Routes } from "react-router-dom";
import Contact from "./pages/Contactus/Contact";
import Home from "./pages/Home/Home";
import ExploreFood from "./pages/Explore/ExploreFood";
import FoodDetail from "./pages/FoodDetail/FoodDetail";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/Place Order/PlaceOrder";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { ToastContainer } from "react-toastify";
import MyOrder from "./pages/MyOrders/MyOrder";
import { useContext } from "react";
import { StoreContext } from "./context/StoreContext";


const App = () => {
  const {token} = useContext(StoreContext);
  return (
    <div>
      <Menubar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<ExploreFood />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/order" element={token ? <PlaceOrder/> : <Login/>} />
        <Route path="/register" element={token ? <Home/> : <Register />} />
        <Route path="/login" element={token ? <Home/> : <Login />} />
        <Route path="/myorders" element={token ?  <MyOrder /> : <Login/>} />
      </Routes>
    </div>
  );
};

export default App;
