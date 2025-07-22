import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { registerUser } from "../../service/AuthService";



const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onsubmitHandler = async(event) => {
    event.preventDefault();
    try{
      const response = await registerUser(data);
     if(response.status === 201){
      toast.success("Registation Completed. Please Login.");
      navigate("/login");
     }
     else{
      toast.error("Unable to register. Please try again!");
     }
    }catch(error){
      toast.error("Unable to register. Please try again!");
    }
    
  };

  return (
    <div className="container-fluid register-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h2 className="card-title text-center mb-2 fw-bold fs-3 text-primary">
                🍽️ Join the Feast at{" "}
                <span className="text-danger-emphasis">EatX</span>
              </h2>
              <h5 className="card-title text-center mb-4 fw-semibold text-body-secondary">
                Your delicious journey begins here — register to unlock flavors!
                🌟
              </h5>

              <form onSubmit={onsubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="Enter your full name"
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    required
                  />
                  <label htmlFor="floatingName">Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                    required
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    onChange={onChangeHandler}
                    value={data.password}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-outline-primary btn-login text-uppercase "
                    type="submit"
                  >
                    Sign up
                  </button>
                  <button
                    className="btn btn-outline-danger btn-login text-uppercase  mt-3"
                    type="reset"
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-4">
                  Already have an account?<Link to="/login">Login</Link>
                </div>
              </form>
              <p className="text-center mt-4 text-muted small">
                Powered by <strong>Ankesh❤️</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
