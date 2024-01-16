import axios from "axios";
//http://localhost:5000
const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default instance;
