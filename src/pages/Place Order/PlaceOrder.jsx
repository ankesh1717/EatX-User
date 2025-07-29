import React, { useContext, useState } from "react";
import { assets, categories } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotal } from "../../util/cartUtil";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { RAZORPAY_KEY } from "../../util/contants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({ ...data, [name]: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName} ${data.address} ${data.city} ${data.state} ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderItems: cartItems.map((item) => ({
        foodId: item.foodId,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: total.toFixed(2),
      orderStatus: "Preparing",
    };
    try {
      const response = await axios.post(
        "https://eatx-api-1.onrender.com/api/orders/create",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201 && response.data.razorpayOrderId) {
        //Initiate the payment
        initiateRazorpayPayment(response.data);
      } else {
        toast.error("Unable to place order. Please try again");
      }
    } catch (error) {
      toast.error("Unable to place order. Please try again!");
    }
  };

  const initiateRazorpayPayment = (order) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount * 100, // Multiply by 100 for paise
      currency: "INR",
      name: "Food Land",
      description: "Food Order Payment",
      order_id: order.razorpayOrderId,
      handler: async function (razorpayResponse) {
        await verifyPayment(razorpayResponse);
      },
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: async function () {
          toast.error("Payment cancelled.");
          await deleteOrder(order.id);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (razorpayResponse) => {
    const paymentData = {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };

    try {
      const response = await axios.post(
        "https://eatx-api-1.onrender.com/api/orders/verify",
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("Payment is successful.");
        await clearCart();
        navigate("/myorders");
      } else {
        toast.error("Payment failed. Please try again");
        navigate("/");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(
        `https://eatx-api-1.onrender.com/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      toast.error("Something wents wrong. Contact Support.");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("https://eatx-api-1.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuantities({});
    } catch (error) {
      toast.error("Error while clearing the cart.");
    }
  };

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);

  const { subtotal, shipping, tax, total } = calculateCartTotal(
    cartItems,
    quantities
  );

  return (
    <div className="container mt-4">
      <main>
        <div className="text-center">
          <img
            className="d-block mx-auto"
            src={assets.logo}
            alt=""
            width="130"
            height="70"
          />
        </div>
        <div className="row g-5">
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">
                {cartItems.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between"
                >
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-body-secondary">
                      Qty: {quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    ₹{item.price * quantities[item.id]}
                  </span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span>Shipping</span>
                </div>
                <span className="text-body-secondary">
                  &#8377;{subtotal === 0 ? 0 : shipping.toFixed(2)}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <div>
                  <span className="text-body-secondary">Tax(12%)</span>
                  <br />
                  <small>[Inclusive of all taxes]</small>
                </div>
                <span className="text-body-secondary">
                  &#8377;{tax.toFixed(2)}
                </span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Total (INR)</span>{" "}
                <strong>&#8377;{total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>
            <form className="needs-validation" onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="Enter your first name"
                    required
                    name="firstName"
                    onChange={onChangeHandler}
                    value={data.firstName}
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="Enter your last name"
                    value={data.lastName}
                    required
                    onChange={onChangeHandler}
                    name="lastName"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email here..."
                      name="email"
                      onChange={onChangeHandler}
                      value={data.email}
                      required
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    placeholder="Enter your phone number here..."
                    required
                    value={data.phoneNumber}
                    name="phoneNumber"
                    onChange={onChangeHandler}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="H.no/Bulding no./Street Name/Colony Name"
                    required
                    value={data.address}
                    name="address"
                    onChange={onChangeHandler}
                  />
                </div>
                <div className="col-md-5">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <select
                    className="form-select"
                    id="state"
                    name="state"
                    value={data.state}
                    onChange={onChangeHandler}
                    required
                  >
                    <option value="">Choose...</option>
                    <option>Madhya Pradesh</option>
                    <option>Bihar</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <select
                    className="form-select"
                    id="city"
                    name="city"
                    value={data.city}
                    onChange={onChangeHandler}
                    required
                  >
                    <option value="">Choose...</option>
                    <option>Bhopal</option>
                    <option>Babhnauli</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="zip" className="form-label">
                    Zip
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip"
                    placeholder="Pin code"
                    name="zip"
                    value={data.zip}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
              </div>

              <hr className="my-4" />
              <button
                className="w-100 btn btn-primary btn-lg"
                type="submit"
                disabled={cartItems.length === 0}
              >
                Continue to checkout
              </button>
            </form>
          </div>
        </div>
      </main>
      <footer className="my-5 pt-4 text-center text-muted small border-top">
        <Footer />
      </footer>
    </div>
  );
};

export default PlaceOrder;
