export const envs = {
  API_BASE_URL:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_BASE_URL
      : "/api",
  API_URL:
    import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "/",
};
