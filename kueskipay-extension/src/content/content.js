// src/content/content.js

console.log("KueskiPay Assistant: Content script activo");

// Escuchar mensajes desde el Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkStore") {
    const hostname = window.location.hostname.toLowerCase();
    const isAmazon = hostname.includes("amazon");
    
    sendResponse({ 
      isAliada: isAmazon, 
      storeName: isAmazon ? "Amazon" : "Desconocida" 
    });
  }
  return true; // Mantiene el canal abierto para respuestas asíncronas
});