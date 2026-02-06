import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthProvider";
import { LoaderProvider } from "./context/LoaderContext/page";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LoaderProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LoaderProvider>
  </React.StrictMode>
);