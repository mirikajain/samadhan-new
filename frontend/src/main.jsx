window.deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  console.log("Install prompt captured");
});



import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
window.deferredPrompt = null;




ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

