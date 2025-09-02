import "regenerator-runtime/runtime";
import "./suppressWarnings";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";

const container = document.getElementById("app");
const root = createRoot(container);

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!clientId) {
  console.error("Google Client ID is not set in environment variables.");
}

root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
          <Analytics />
        </GoogleOAuthProvider>
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </ErrorBoundary>
);