import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import PrivyProviderComponent from "@/providers/PrivyProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <PrivyProviderComponent>
    <App />
  </PrivyProviderComponent>
);
