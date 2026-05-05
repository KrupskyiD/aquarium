import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthSessionProvider } from "./app/AuthSessionContext.jsx";
import { AppRouter } from "./app/router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthSessionProvider>
      <AppRouter />
    </AuthSessionProvider>
  </StrictMode>,
);
