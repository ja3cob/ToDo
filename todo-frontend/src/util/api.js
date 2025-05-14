import axios from "axios";

const apiUrl = "https://todo.beckersoft.pl";

const api = axios.create({
  baseURL: apiUrl + "/api/",
  timeout: 10000,
});

export default api;
