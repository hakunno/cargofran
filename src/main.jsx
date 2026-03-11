import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext"; // Import AuthProvider
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { registerSW } from "virtual:pwa-register";

// Register the service worker for offline functionality
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

createRoot(document.getElementById("root")).render(
  <AuthProvider> {/* Wrap App inside AuthProvider */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
