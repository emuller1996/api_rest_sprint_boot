import { initThemeMode } from "flowbite-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ThemeInit } from "../.flowbite-react/init";
import App from "./App.tsx";
import "./index.css";

// Importar la configuración de axios (opcional)
import "./config/axios";
import { ToastContainer } from "react-toastify";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeInit />
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </StrictMode>,
);

initThemeMode();
