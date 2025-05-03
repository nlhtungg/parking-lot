import axios from "axios";
import toast from "react-hot-toast";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Ensure cookies are sent with requests
});

// Add a response interceptor to handle 401 errors and role-based access
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login page on unauthorized access
            window.location.href = "/login";
        } else if (error.response?.status === 403) {
            // Handle forbidden access based on roles
            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/admin")) {
                toast.error("Access denied: Admins only");
                window.location.href = "/employee";
            } else if (currentPath.startsWith("/employee")) {
                toast.error("Access denied: Employees only");
                window.location.href = "/admin";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
