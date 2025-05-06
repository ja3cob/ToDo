import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { email, password });
      navigate("/");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 mb-2 rounded" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 mb-4 rounded" />
      <button onClick={handleRegister} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
    </div>
  );
};

export default Register;