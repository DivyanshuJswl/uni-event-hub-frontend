import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "./context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react"

const container = document.getElementById("app");
const root = createRoot(container);
// console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
if (!clientId) {
  console.error("Google Client ID is not set in environment variables.");
}
root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
        <Analytics />
      </GoogleOAuthProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
