import api from "./api";

export async function testConnection() {
  try {
    const response = await api.get("/health");
    console.log("Backend connection successful:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Backend connection failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
}
