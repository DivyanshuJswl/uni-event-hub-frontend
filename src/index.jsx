import "regenerator-runtime/runtime";
import "./suppressWarnings";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "context/AuthContext";

const container = document.getElementById("app");
const root = createRoot(container);

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!clientId) {
  console.error("Google Client ID is not set in environment variables.");
}

root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <MaterialUIControllerProvider>
          <GoogleOAuthProvider clientId={clientId}>
            <App />
          </GoogleOAuthProvider>
        </MaterialUIControllerProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
