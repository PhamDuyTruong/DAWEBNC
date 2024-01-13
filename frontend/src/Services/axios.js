import axios from "axios";
//https://elearning-g2i8.onrender.com
const instance = axios.create({
  baseURL: "https://elearning-g2i8.onrender.com/api",
});

export default instance;
