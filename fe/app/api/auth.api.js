import api from "./config";

export const login = async (credentials) => {
    try {
        const response = await api.post("/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const logout = async () => {
    try {
        await api.post("/logout");
        window.location.href = "/login";
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
