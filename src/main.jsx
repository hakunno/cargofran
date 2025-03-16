import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext"; // Import AuthProvider

createRoot(document.getElementById("root")).render(
  <AuthProvider> {/* Wrap App inside AuthProvider */}
    <BrowserRouter basename="/cargofran">
      <App />
    </BrowserRouter>
  </AuthProvider>
);
