import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../util/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Logowanie</h2>
      <input type="text" placeholder="Nazwa użytkownika" value={username} onChange={e => setUsername(e.target.value)} className="w-full border p-2 mb-2 rounded" />
      <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 mb-4 rounded" />
      <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Zaloguj
      </button>
    </div>
  );
};

export default Login;
