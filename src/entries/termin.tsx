import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { Termin } from "../pages/Termin";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Termin />
  </StrictMode>,
);
