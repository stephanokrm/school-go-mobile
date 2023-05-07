import Axios from "axios";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

export default axios;
