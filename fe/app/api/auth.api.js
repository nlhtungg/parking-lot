import api from "./config";

export const login = async (credentials) => {
    try {
        const response = await api.post("/auth/login", credentials);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const logout = async () => {
    try {
        await api.post("/auth/logout");
        window.location.href = "/login";
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
