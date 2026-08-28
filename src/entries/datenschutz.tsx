import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { Datenschutz } from "../pages/Datenschutz";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Datenschutz />
  </StrictMode>,
);
