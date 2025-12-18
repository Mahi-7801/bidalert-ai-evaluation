import { createRoot } from "react-dom/client";
import { InsforgeProvider } from "@insforge/react";
import App from "./App.tsx";
import "./index.css";

// Disable noisy console logs in all builds (keep errors)
const silent = () => {};
console.log = silent;
console.info = silent;
console.debug = silent;
console.warn = silent;
// console.error is kept so real errors still appear in DevTools

createRoot(document.getElementById("root")!).render(
  <InsforgeProvider
    baseUrl={'https://8hdey9g3.us-east.insforge.app'}
  >
    <App />
  </InsforgeProvider>
);
