/** Public URL of the React client (no trailing slash). */
export const getClientUrl = () => {
  const url =
    process.env.CLIENT_URL ||
    process.env.APP_URL ||
    "http://localhost:5173";
  return url.replace(/\/$/, "");
};
