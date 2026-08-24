import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { Impressum } from "../pages/Impressum";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Impressum />
  </StrictMode>,
);
