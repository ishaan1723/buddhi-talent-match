import { createContext, useContext, useState, useEffect } from "react";
import { fetchGoogleSheetData } from "./googleSheets";

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  phone: "9824468558",
  whatsapp: "919824468558",
  email: "info@techbharat.net",
  address: "6, Shriji Bungalows, Deesa-Palanpur Highway, Palanpur"
};

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || "";

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    if (SHEET_ID) {
      fetchGoogleSheetData(SHEET_ID, "Settings").then((data) => {
        if (data && data.length > 0) {
          const newSettings = { ...DEFAULT_SETTINGS };
          data.forEach(item => {
            if (item.key && item.value !== undefined) {
              const cleanedKey = item.key.toLowerCase().trim();
              newSettings[cleanedKey] = String(item.value);
            }
          });
          setSettings(newSettings);
        }
      });
    }
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
