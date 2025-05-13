import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: `http://${apiUrl}/api/v1`,
    headers: {
        "Content-type": "application/json",
    }
})

export default axiosInstance;