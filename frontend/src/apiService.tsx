import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

const AxiosInstance = axios.create({
	baseURL: "http://localhost:5065",
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

AxiosInstance.interceptors.response.use(undefined, async (error) => {
	if (error.response?.status === 401) {
		return AxiosInstance(error.config); // Retry original request
	}

	throw error;
});

export default AxiosInstance;
