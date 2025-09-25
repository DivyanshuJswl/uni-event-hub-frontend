// Centralized configuration for Google Sheets access used by getcertificate pages

export function getGoogleSheetsConfig() {
  const apiKey = (import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_VITE_GOOGLE_API_KEY || "").trim();
  const sheetId = (import.meta.env.VITE_GOOGLE_SHEET_ID || "").trim();
  const range = (import.meta.env.VITE_GOOGLE_SHEET_RANGE || "Form Responses 1").trim();

  return { apiKey, sheetId, range };
}

export function getSheetsValuesUrl() {
  const { apiKey, sheetId, range } = getGoogleSheetsConfig();
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
}


