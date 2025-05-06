import axios from "axios";

const apiUrl = import.meta.env.SERVER_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: apiUrl + "/api/",
  timeout: 10000,
});

export default api;