import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { Storno } from "../pages/Storno";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Storno />
  </StrictMode>,
);
