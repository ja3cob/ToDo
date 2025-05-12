import axios from "axios";

const apiUrl = "https://todoapp.mooo.com";

const api = axios.create({
  baseURL: apiUrl + "/api/",
  timeout: 10000,
});

export default api;