import axios from "axios";
//https://winshop-server.onrender.com/
const instance = axios.create({
  baseURL: "http://localhost:5000/",
});

export default instance;
